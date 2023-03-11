import { generateSecretKey } from './generateSecretKey';
describe('generateSecretKey', () => {
    it('should generate a secret key', () => {
        let set = new Set<string>();
        for (let i = 0; i < 1000; i++) {
            let k = generateSecretKey();
            expect(set.has(k)).toBe(false);
            set.add(k);
        }
    });
});