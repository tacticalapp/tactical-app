import { normalizeSecretKey } from './normalizeSecretKey';
describe('normalizeSecretKey', () => {
    it('should normalize secret key', () => {
        expect(normalizeSecretKey('A-B-C')).toBe('ABC');
        expect(normalizeSecretKey('a-b-c')).toBe('ABC');
        expect(normalizeSecretKey('a-b-c-')).toBe('ABC');
        expect(normalizeSecretKey('a-b----c-')).toBe('ABC');
    });
});