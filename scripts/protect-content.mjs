import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';
import { protectMarkdown } from './content-crypto.mjs';

function usage() {
    console.error('Usage: npm run protect -- <source.private.md> <public.md> [--force]');
}

function readHidden(prompt) {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
        return Promise.reject(new Error('Use an interactive terminal or set BLOG_CONTENT_PASSPHRASE'));
    }

    return new Promise((resolve, reject) => {
        readline.emitKeypressEvents(process.stdin);
        process.stdout.write(prompt);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        let value = '';

        const finish = (error) => {
            process.stdin.off('keypress', onKeypress);
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdout.write('\n');
            error ? reject(error) : resolve(value);
        };

        const onKeypress = (text, key) => {
            if (key?.ctrl && key.name === 'c') {
                finish(new Error('Cancelled'));
            } else if (key?.name === 'return' || key?.name === 'enter') {
                finish();
            } else if (key?.name === 'backspace') {
                if (value.length > 0) {
                    value = Array.from(value).slice(0, -1).join('');
                    process.stdout.write('\b \b');
                }
            } else if (text && !key?.ctrl && !key?.meta) {
                value += text;
                process.stdout.write('*');
            }
        };
        process.stdin.on('keypress', onKeypress);
    });
}

async function getPassphrase() {
    const fromEnvironment = process.env.BLOG_CONTENT_PASSPHRASE;
    if (fromEnvironment) {
        process.env.BLOG_CONTENT_PASSPHRASE = '';
        return fromEnvironment;
    }

    const first = await readHidden('Encryption passphrase: ');
    const second = await readHidden('Confirm passphrase: ');
    if (first !== second) {
        throw new Error('Passphrases do not match');
    }
    return first;
}

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const files = args.filter((arg) => arg !== '--force');
    if (files.length !== 2) {
        usage();
        process.exitCode = 1;
        return;
    }

    const sourcePath = path.resolve(files[0]);
    const outputPath = path.resolve(files[1]);
    if (!sourcePath.endsWith('.private.md')) {
        throw new Error('The plaintext source filename must end with .private.md');
    }
    if (outputPath.endsWith('.private.md') || sourcePath === outputPath) {
        throw new Error('The public output must be a different .md file');
    }

    const markdown = await readFile(sourcePath, 'utf8');
    const passphrase = await getPassphrase();
    const result = await protectMarkdown(markdown, passphrase);
    await mkdir(path.dirname(outputPath), { recursive: true });

    try {
        await writeFile(outputPath, result.markdown, { encoding: 'utf8', flag: force ? 'w' : 'wx' });
    } catch (error) {
        if (error.code === 'EEXIST') {
            throw new Error('Output already exists; use --force to replace it');
        }
        throw error;
    }

    console.log(`Protected ${result.count} code block(s) in ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
    console.error(`Protection failed: ${error.message}`);
    process.exitCode = 1;
});
