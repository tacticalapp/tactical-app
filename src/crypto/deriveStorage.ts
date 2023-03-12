import { normalizePassword } from "./normalizePassword";
import { pbkdf2 } from "./primitives/pbkdf2";

export async function deriveStorage(password: string) {
    const passwordKey = await pbkdf2({ password: Buffer.from(password), salt: Buffer.from('#storage'), iterations: 100000, bits: 256 });
    return passwordKey;
}