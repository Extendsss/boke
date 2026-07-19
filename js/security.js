(function () {
    'use strict';

    const PROTECTED_MARKER = 'boke-protected:v1';
    const ADDITIONAL_DATA = 'boke-protected-content:v1';
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const markerPattern = new RegExp(
        `<!--\\s*${PROTECTED_MARKER.replace(':', '\\:')}:([A-Za-z0-9_-]+)\\s*-->`,
        'g'
    );

    function decodeBase64Url(value) {
        if (typeof value !== 'string' || value.length > 2_000_000 || !/^[A-Za-z0-9_-]+$/.test(value)) {
            throw new Error('Invalid protected payload encoding');
        }
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
        const binary = atob(padded);
        return Uint8Array.from(binary, (character) => character.charCodeAt(0));
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

    async function decryptProtectedToken(token, passphrase) {
        if (typeof passphrase !== 'string' || passphrase.length < 12) {
            throw new Error('Invalid passphrase');
        }

        const envelope = parseEnvelope(token);
        const salt = decodeBase64Url(envelope.salt);
        const iv = decodeBase64Url(envelope.iv);
        const encrypted = decodeBase64Url(envelope.data);
        if (salt.length !== 16 || iv.length !== 12 || encrypted.length < 17) {
            throw new Error('Invalid protected payload');
        }

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                hash: 'SHA-256',
                salt,
                iterations: envelope.iterations
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        const plaintext = await crypto.subtle.decrypt(
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

    function injectProtectedPlaceholders(markdown) {
        return markdown.replace(markerPattern, (_, token) => (
            `\n<section class="protected-block" data-protected-payload="${token}"></section>\n`
        ));
    }

    function sanitizeMarkdownHtml(html) {
        if (!window.DOMPurify) {
            throw new Error('HTML sanitizer is unavailable');
        }
        return window.DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
            FORBID_TAGS: ['button', 'embed', 'form', 'iframe', 'input', 'object', 'option', 'select', 'style', 'textarea'],
            FORBID_ATTR: ['style', 'target'],
            ADD_ATTR: ['data-backup', 'data-protected-payload']
        });
    }

    function makeLockHeader(title, unlocked) {
        const header = document.createElement('div');
        header.className = 'protected-block__header';

        const heading = document.createElement('div');
        heading.className = 'protected-block__title';
        const icon = document.createElement('span');
        icon.className = 'protected-block__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = unlocked ? '🔓' : '🔒';
        const label = document.createElement('span');
        label.textContent = title;
        heading.append(icon, label);

        const badge = document.createElement('span');
        badge.className = 'protected-block__badge';
        badge.textContent = unlocked ? '已解锁' : 'AES-256-GCM';
        header.append(heading, badge);
        return header;
    }

    function renderLockedBlock(block, token) {
        block.classList.remove('is-unlocked');
        block.dataset.protectedPayload = token;

        const form = document.createElement('form');
        form.className = 'protected-block__form';

        const input = document.createElement('input');
        input.className = 'protected-block__input';
        input.type = 'password';
        input.autocomplete = 'off';
        input.autocapitalize = 'none';
        input.spellcheck = false;
        input.required = true;
        input.minLength = 12;
        input.placeholder = '访问口令';
        input.setAttribute('aria-label', '访问口令');

        const button = document.createElement('button');
        button.className = 'btn primary protected-block__submit';
        button.type = 'submit';
        button.textContent = '解锁';

        const status = document.createElement('div');
        status.className = 'protected-block__status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');

        form.append(input, button);
        block.replaceChildren(makeLockHeader('受保护内容', false), form, status);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;

            const passphrase = input.value;
            input.value = '';
            input.disabled = true;
            button.disabled = true;
            button.textContent = '解密中';
            status.textContent = '';

            try {
                const secret = await decryptProtectedToken(token, passphrase);
                const header = makeLockHeader(secret.title || '受保护代码', true);
                const lockButton = document.createElement('button');
                lockButton.className = 'protected-block__lock';
                lockButton.type = 'button';
                lockButton.textContent = '锁定';
                lockButton.title = '重新锁定内容';
                header.appendChild(lockButton);

                const pre = document.createElement('pre');
                const code = document.createElement('code');
                if (/^[A-Za-z0-9_+.-]{1,32}$/.test(secret.language || '')) {
                    code.className = `language-${secret.language}`;
                }
                code.textContent = secret.content;
                pre.appendChild(code);

                block.classList.add('is-unlocked');
                block.removeAttribute('data-protected-payload');
                block.replaceChildren(header, pre);
                lockButton.addEventListener('click', () => renderLockedBlock(block, token));
            } catch {
                input.disabled = false;
                button.disabled = false;
                button.textContent = '解锁';
                status.textContent = '口令不正确或内容已损坏';
                input.focus();
            }
        });
    }

    function hydrateProtectedBlocks(root) {
        root.querySelectorAll('.protected-block[data-protected-payload]').forEach((block) => {
            renderLockedBlock(block, block.dataset.protectedPayload);
        });
    }

    window.BokeSecurity = Object.freeze({
        hydrateProtectedBlocks,
        injectProtectedPlaceholders,
        sanitizeMarkdownHtml
    });
}());
