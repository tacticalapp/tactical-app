import * as ed from '@noble/ed25519';
export async function signPackage(data: Buffer, secretKey: Buffer) {
    let signature = await ed.sign(data, secretKey);
    return Buffer.from(signature);
}