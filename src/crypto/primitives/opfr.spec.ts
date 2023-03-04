import * as o from './oprf';

describe('opfr', () => {
    it('should hash correctly', async () => {
        expect(await o.createDerivedKey('hello-password')).toBe('6a8642051310a8ca4562a8112b52c13e587594251bd411f4b744bde9be02514a');
    });
    it('should perform end-to-end', async () => {

        // Source: https://github.com/multiparty/oprf/blob/39d1d75f5c0c218a779bf5381651a0799582cff6/test/oprf.spec.ts#L7

        // Client part
        let key = await o.createDerivedKey('hello-password');
        let masked = await o.createMaskedKey(key);

        // Server part
        const secretKey = o.createRandomScalar();
        const salted = o.scalarMult(masked.point, secretKey);

        // Client part
        const unmasked = o.scalarMult(salted, o.scalarInvert(masked.mask));

        // Check 
        const correct = o.scalarMult(key, secretKey);
        expect(unmasked).toBe(correct);
    });
});