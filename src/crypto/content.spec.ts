import { contentDecrypt, contentEncrypt } from "./content";

describe('content', () => {
    it('should encrypt and decrypt', async () => {
        let encrypted = await contentEncrypt({ key: 'hello', value: Buffer.from('world'), secret: Buffer.from('secret') });
        let decrypted = await contentDecrypt({ key: encrypted.key, value: encrypted.value, secret: Buffer.from('secret') });
        expect(decrypted).toMatchObject({ key: 'hello', value: Buffer.from('world') });
    });
});