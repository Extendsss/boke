import { webcrypto } from 'node:crypto';

const cryptoApi = globalThis.crypto ?? webcrypto;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

export const PROTECTED_MARKER = 'boke-protected:v1';
export const PBKDF2_ITERATIONS = 600_000;
export const ADDITIONAL_DATA = 'boke-protected-content:v1';

const PRIVATE_FENCE = /^```private(?::([A-Za-z0-9_+.-]{1,32}))?(?:\s+title="([^"\r\n]{1,100})")?\s*\r?\n([\s\S]*?)^```[ \t]*$/gm;

function encodeBase64Url(bytes) {
    return Buffer.from(bytes).toString('base64url');
}

function decodeBase64Url(value) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) {
        throw new Error('Invalid protected payload encoding');
    }
    return new Uint8Array(Buffer.from(value, 'base64url'));
}

function validatePassphrase(passphrase) {
    if (typeof passphrase !== 'string' || passphrase.length < 12) {
        throw new Error('Passphrase must contain at least 12 characters');
    }
}

async function deriveKey(passphrase, salt, iterations, usages) {
    const keyMaterial = await cryptoApi.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return cryptoApi.subtle.deriveKey(
        { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        usages
    );
}

function parseEnvelope(token) {
    const envelope = JSON.parse(decoder.decode(decodeBase64Url(token)));
    if (
        envelope?.v !== 1 ||
        envelope?.alg !== 'A256GCM' ||
        envelope?.kdf !== 'PBKDF2-SHA256' ||
        !Number.isInteger(envelope?.iterations) ||
        envelope.iterations < 100_000 ||
        envelope.iterations > 1_000_000
    ) {
        throw new Error('Unsupported protected payload');
    }
    return envelope;
}

export async function createProtectedToken(secret, passphrase) {
    validatePassphrase(passphrase);
    if (!secret || typeof secret.content !== 'string') {
        throw new Error('Protected content must be a string');
    }

    const salt = cryptoApi.getRandomValues(new Uint8Array(16));
    const iv = cryptoApi.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt, PBKDF2_ITERATIONS, ['encrypt']);
    const plaintext = encoder.encode(JSON.stringify({
        type: 'code',
        language: secret.language || 'text',
        title: secret.title || '受保护代码',
        content: secret.content
    }));
    const encrypted = await cryptoApi.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
            additionalData: encoder.encode(ADDITIONAL_DATA),
            tagLength: 128
        },
        key,
        plaintext
    );

    const envelope = {
        v: 1,
        alg: 'A256GCM',
        kdf: 'PBKDF2-SHA256',
        iterations: PBKDF2_ITERATIONS,
        salt: encodeBase64Url(salt),
        iv: encodeBase64Url(iv),
        data: encodeBase64Url(new Uint8Array(encrypted))
    };
    return encodeBase64Url(encoder.encode(JSON.stringify(envelope)));
}

export async function openProtectedToken(token, passphrase) {
    validatePassphrase(passphrase);
    const envelope = parseEnvelope(token);
    const salt = decodeBase64Url(envelope.salt);
    const iv = decodeBase64Url(envelope.iv);
    const encrypted = decodeBase64Url(envelope.data);
    if (salt.length !== 16 || iv.length !== 12 || encrypted.length < 17) {
        throw new Error('Invalid protected payload');
    }

    const key = await deriveKey(passphrase, salt, envelope.iterations, ['decrypt']);
    const plaintext = await cryptoApi.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
            additionalData: encoder.encode(ADDITIONAL_DATA),
            tagLength: 128
        },
        key,
        encrypted
    );
    const secret = JSON.parse(decoder.decode(plaintext));
    if (secret?.type !== 'code' || typeof secret?.content !== 'string') {
        throw new Error('Invalid protected content');
    }
    return secret;
}

export async function protectMarkdown(markdown, passphrase) {
    validatePassphrase(passphrase);
    const matches = [...markdown.matchAll(PRIVATE_FENCE)];
    if (matches.length === 0) {
        throw new Error('No private code fences were found');
    }

    let cursor = 0;
    let protectedMarkdown = '';
    for (const match of matches) {
        const [source, language = 'text', title = '受保护代码', content] = match;
        protectedMarkdown += markdown.slice(cursor, match.index);
        const token = await createProtectedToken({ language, title, content }, passphrase);
        protectedMarkdown += `<!-- ${PROTECTED_MARKER}:${token} -->`;
        cursor = match.index + source.length;
    }
    protectedMarkdown += markdown.slice(cursor);

    if (/^```private(?::|\s|$)/m.test(protectedMarkdown)) {
        throw new Error('An unprocessed private code fence remains in the output');
    }
    for (const match of matches) {
        if (match[3] && protectedMarkdown.includes(match[3])) {
            throw new Error('Plaintext remained in the protected output');
        }
    }
    return { markdown: protectedMarkdown, count: matches.length };
}
