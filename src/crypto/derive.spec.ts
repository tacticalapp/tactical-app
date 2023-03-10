import { derive } from './derive';
describe('derive', () => {
    it('should derive a key', async () => {
        const authSecret = await derive({
            username: 'steve',
            secretKey: 'some-secret-key',
            password: 'master-password',
            usage: 'auth'
        });
        const encryptionSecret = await derive({
            username: 'steve',
            secretKey: 'some-secret-key',
            password: 'master-password',
            usage: 'encryption'
        });
        expect(authSecret.toString('hex')).toBe('73aa8d23ea10d59764c2bda7b78d1a86022ad1528cd110a9c1b74b0475f73bc4');
        expect(encryptionSecret.toString('hex')).toBe('6c927ce8cff920ac0c5453b06332e7d6f3c19f84cd0f9ef8e105447d4f390ba0');
    });
});