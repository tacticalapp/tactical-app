import { randomBytes } from 'crypto';
import { computeSharedSecret } from './computeSharedSecret';
import * as ed from "@noble/ed25519";

describe('computeSharedSecret', () => {
    it('should compute correct shared secret', async () => {
        let secretA = randomBytes(32);
        let secretB = randomBytes(32);
        let publicA = Buffer.from(await ed.getPublicKey(secretA));
        let publicB = Buffer.from(await ed.getPublicKey(secretB));
        let sharedA = await computeSharedSecret({ publicKey: publicB, secretKey: secretA });
        let sharedB = await computeSharedSecret({ publicKey: publicA, secretKey: secretB });
        expect(sharedA.equals(sharedB)).toBe(true);
    });
});