import { derive } from './derive';
describe('derive', () => {
    it('should derive a key', async () => {
        const authSecret = await derive({
            accountId: 'steve',
            accountSalt: Buffer.from('steve-salt'),
            secretKey: 'some-secret-key',
            masterPassword: 'master-password',
            usage: 'auth'
        });
        const encryptionSecret = await derive({
            accountId: 'steve',
            accountSalt: Buffer.from('steve-salt'),
            secretKey: 'some-secret-key',
            masterPassword: 'master-password',
            usage: 'encryption'
        });
        expect(authSecret.toString('hex')).toBe('710b5516ab4d3629f5187ba4cc4929e7692e3b267ce5cc3142e75107783bffce');
        expect(encryptionSecret.toString('hex')).toBe('c675b16c4bf1f869377d8317355a1ccc6b941cbf76a8bd350dde69694269398d');
    });
});