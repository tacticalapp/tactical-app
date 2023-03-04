import { sha256 } from './sha256';

describe('sha256', () => {
    it('should hash correctly', async () => {
        expect((await sha256(Buffer.from('hello world'))).toString('hex')).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    });
});