import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const TEXT_EXTENSIONS = new Set([
    '.css', '.env', '.html', '.java', '.js', '.json', '.md', '.mjs', '.properties',
    '.sql', '.ts', '.tsx', '.xml', '.yaml', '.yml'
]);
const EXCLUDED_DIRECTORIES = new Set(['.git', '.idea', 'node_modules', 'private-posts']);
const EXCLUDED_PREFIXES = ['js/libs/'];
const RULES = [
    { name: 'private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
    { name: 'AWS access key', regex: /AKIA[0-9A-Z]{16}/g },
    { name: 'Google API key', regex: /AIza[0-9A-Za-z_-]{35}/g },
    { name: 'GitHub token', regex: /gh[pousr]_[0-9A-Za-z]{36,255}/g },
    { name: 'OpenAI-style key', regex: /sk-[A-Za-z0-9_-]{20,}/g },
    { name: 'JWT', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
    {
        name: 'password or secret assignment',
        regex: /(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"\r\n]{8,}['"]/gi
    },
    { name: 'credential in URL', regex: /(?:https?|mongodb(?:\+srv)?|redis):\/\/[^\s/:]+:[^\s/@]+@/gi }
];

function candidateFiles(directory = '.') {
    const files = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
        const candidate = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...candidateFiles(candidate));
        } else if (entry.isFile()) {
            files.push(candidate.replace(/^\.([/\\])/, ''));
        }
    }
    return files;
}

function redact(value) {
    const compact = value.replace(/\s+/g, ' ');
    if (compact.length <= 12) return '[redacted]';
    return `${compact.slice(0, 4)}...${compact.slice(-4)}`;
}

const findings = [];
for (const file of candidateFiles()) {
    const normalized = file.replaceAll('\\', '/');
    if (EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) continue;
    if (normalized.endsWith('.private.md') || path.basename(file).startsWith('.env')) continue;
    const extension = path.extname(file).toLowerCase();
    if (!TEXT_EXTENSIONS.has(extension) && path.basename(file) !== '.env') continue;

    const stats = statSync(file);
    if (!stats.isFile() || stats.size > MAX_FILE_SIZE) continue;
    const content = readFileSync(file, 'utf8');
    for (const rule of RULES) {
        rule.regex.lastIndex = 0;
        for (const match of content.matchAll(rule.regex)) {
            const line = content.slice(0, match.index).split('\n').length;
            findings.push({ file: normalized, line, rule: rule.name, preview: redact(match[0]) });
        }
    }
}

if (findings.length > 0) {
    console.error('Potential secrets found:');
    for (const finding of findings) {
        console.error(`- ${finding.file}:${finding.line} [${finding.rule}] ${finding.preview}`);
    }
    process.exitCode = 1;
} else {
    console.log('Secret scan passed: no credential patterns found in publishable files.');
}
