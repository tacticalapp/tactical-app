import * as ed from "@noble/ed25519";

export async function computeSharedSecret(args: { publicKey: Buffer, secretKey: Buffer }) {
    return Buffer.from(await ed.getSharedSecret(args.secretKey, args.publicKey))
}