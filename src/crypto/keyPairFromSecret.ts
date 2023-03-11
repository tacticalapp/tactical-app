import { sha256 } from '@noble/hashes/sha256';
import * as ed25519 from '@noble/ed25519';

export async function keyPairFromSecret(secret: Buffer): Promise<{ secretKey: Buffer, publicKey: Buffer }> {
    let seed = sha256(secret);
    let secretKey = Buffer.from(seed);
    let publicKey = Buffer.from(await ed25519.getPublicKey(secretKey));
    return { secretKey, publicKey };
}