export async function hkdf(args: { ikm: Buffer, salt: Buffer, info: Buffer, bits: number }) {
    const ikm = await crypto.subtle.importKey('raw', args.ikm, 'HKDF', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
        name: 'HKDF',
        hash: 'SHA-256',
        salt: args.salt,
        info: args.info,
    }, ikm, args.bits);
    return Buffer.from(bits);
}