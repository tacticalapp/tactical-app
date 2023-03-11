import * as ed from '@noble/ed25519';
import { encrypt } from './encrypt';
import { randomBytes } from './randomBytes';

export async function encryptForKey(publicKey: Buffer, message: Buffer) {
    let ephPrivateKey = randomBytes(32);
    let ephPublicKey = await ed.getPublicKey(ephPrivateKey);
    let shared = Buffer.from(await ed.getSharedSecret(ephPrivateKey, publicKey));
    let encrypted = encrypt(shared, message);
    return Buffer.concat([ephPublicKey, encrypted]);
}