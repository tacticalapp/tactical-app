import * as ed from "@noble/ed25519";
import tc from 'tweetnacl';

export async function decryptForKey(secretKey: Buffer, data: Buffer) {
    let publicKey = data.subarray(0, 32);
    let nonce = data.subarray(32, 32 + tc.secretbox.nonceLength);
    let message = data.subarray(32 + tc.secretbox.nonceLength);
    let shared = Buffer.from(await ed.getSharedSecret(secretKey, publicKey));
    let res = tc.secretbox.open(message, nonce, shared);
    if (!res) {
        throw new Error('Invalid key');
    }
    return Buffer.from(res);
}