import * as ed from '@noble/curves/ed25519';
export function signPackage(data: Buffer, secretKey: Buffer) {
    let signature = ed.ed25519.sign(data, secretKey);
    return Buffer.from(signature);
}