import * as ed from "@noble/ed25519";

export async function publicKeyFromSecret(privateKey: Buffer) {
    return Buffer.from(await ed.getPublicKey(privateKey));
}