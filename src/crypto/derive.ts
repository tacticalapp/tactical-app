import { normalizePassword } from "./primitives/normalizePassword";
import { hkdf } from "./primitives/hkdf";
import { pbkdf2 } from "./primitives/pbkdf2";

export async function derive(args: {
    username: string,
    secretKey: string,
    password: string,
    usage: 'auth' | 'encryption'
}) {

    // Derive password
    const passwordNormalized = normalizePassword(args.password);
    const passwordKey = await pbkdf2({ password: Buffer.from(passwordNormalized), salt: Buffer.from(args.username), iterations: 100000, bits: 256 });

    // Derive key
    const secretKey = await hkdf({ ikm: Buffer.from(args.secretKey), salt: Buffer.from(args.username), info: Buffer.from(args.usage + ':secret'), bits: 256 });

    // Combine keys
    return await hkdf({ ikm: Buffer.concat([passwordKey, secretKey]), salt: Buffer.from(args.username), info: Buffer.from(args.usage + ':combined'), bits: 256 });
}