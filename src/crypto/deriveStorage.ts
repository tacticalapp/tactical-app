import { normalizePassword } from "./primitives/normalizePassword";
import { pbkdf2 } from "./primitives/pbkdf2";

export async function deriveStorage(password: string) {
    const passwordNormalized = normalizePassword(password);
    const passwordKey = await pbkdf2({ password: Buffer.from(passwordNormalized), salt: Buffer.from('#storage'), iterations: 100000, bits: 256 });
    return passwordKey;
}