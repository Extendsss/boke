import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createProtectedToken,
    openProtectedToken,
    protectMarkdown,
    PROTECTED_MARKER
} from '../scripts/content-crypto.mjs';

const PASSPHRASE = 'correct horse battery staple';

test('AES-GCM protected content decrypts only with the correct passphrase', async () => {
    const token = await createProtectedToken({
        language: 'java',
        title: '内部示例',
        content: 'String internalValue = "not-published-as-plaintext";'
    }, PASSPHRASE);

    const secret = await openProtectedToken(token, PASSPHRASE);
    assert.equal(secret.language, 'java');
    assert.match(secret.content, /not-published-as-plaintext/);
    await assert.rejects(() => openProtectedToken(token, 'wrong passphrase value'));
});

test('private Markdown fences are replaced without retaining plaintext', async () => {
    const privateValue = ['super', 'sensitive', 'value'].join('-');
    const source = `# Example\n\n\`\`\`private:sql title="内部查询"\nSELECT '${privateValue}';\n\`\`\`\n`;
    const result = await protectMarkdown(source, PASSPHRASE);

    assert.equal(result.count, 1);
    assert.ok(result.markdown.includes(`<!-- ${PROTECTED_MARKER}:`));
    assert.ok(!result.markdown.includes(privateValue));
    assert.ok(!result.markdown.includes('```private'));
});

