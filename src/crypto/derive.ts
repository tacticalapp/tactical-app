import { normalizePassword } from "./primitives/normalizePassword";
import { hkdf } from "./primitives/hkdf";
import { pbkdf2 } from "./primitives/pbkdf2";

export async function derive(args: {
    accountId: string,
    accountSalt: Buffer,
    secretKey: string,
    masterPassword: string,
    usage: 'auth' | 'encryption'
}) {

    // Derive password
    const passwordNormalized = normalizePassword(args.masterPassword);
    const passwordSalt = await hkdf({ ikm: args.accountSalt, salt: Buffer.from(args.accountId), info: Buffer.from(args.usage + ':password'), bits: 256 });
    const passwordKey = await pbkdf2({ password: Buffer.from(passwordNormalized), salt: passwordSalt, iterations: 100000, bits: 256 });

    // Derive key
    const secretKey = await hkdf({ ikm: Buffer.from(args.secretKey), salt: Buffer.from(args.accountId), info: Buffer.from(args.usage + ':secret'), bits: 256 });

    // Combine keys
    return await hkdf({ ikm: Buffer.concat([passwordKey, secretKey]), salt: Buffer.from(args.accountId), info: Buffer.from(args.usage + ':combined'), bits: 256 });
}