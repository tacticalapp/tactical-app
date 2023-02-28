export async function derive(args: { data: string, salt: string }) {
    const ec = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        ec.encode(args.data.normalize('NFKD')),
        'PBKDF2',
        false,
        ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: ec.encode(args.salt),
        iterations: 100000,
    }, key, 256);
    return Buffer.from(bits);
}