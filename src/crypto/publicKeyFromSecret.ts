import * as ed from "@noble/curves/ed25519";

export function publicKeyFromSecret(privateKey: Buffer): Buffer {
    return Buffer.from(ed.ed25519.getPublicKey(privateKey));
}