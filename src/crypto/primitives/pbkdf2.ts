export async function pbkdf2(args: { password: Buffer, salt: Buffer, iterations: number, bits: number }) {
    const key = await crypto.subtle.importKey('raw', args.password, 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: args.salt, iterations: args.iterations, }, key, args.bits);
    return Buffer.from(bits);
}