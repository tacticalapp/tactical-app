import * as ed from '@noble/ed25519';
import * as hash from '@noble/hashes/blake2b';

export async function createDerivedKey(key: string) {
    let hashed = hash.blake2b(Buffer.from(key), { dkLen: 64 });
    return ed.RistrettoPoint.hashToCurve(hashed).toHex();
}

export async function createRandomKey() {
    return ed.RistrettoPoint.hashToCurve(crypto.getRandomValues(new Uint8Array(32)));
}

export function createRandomScalar() {
    while (true) {
        let res = BigInt('0x' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex'));
        if (res > ed.CURVE.l) {
            continue;
        }
        return res;
    }
}

export async function createMaskedKey(src: string) {
    const mask = createRandomScalar();
    const point = ed.RistrettoPoint.fromHex(src).multiply(mask).toHex();
    return {
        mask,
        point
    };
}

export function scalarMult(src: string, scalar: bigint) {
    return ed.RistrettoPoint.fromHex(src).multiply(scalar).toHex();
}

export function scalarInvert(scalar: bigint) {
    return ed.utils.invert(scalar, ed.CURVE.l);
}