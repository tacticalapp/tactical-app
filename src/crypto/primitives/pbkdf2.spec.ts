import { pbkdf2 } from "./pbkdf2";

describe('pbkdf2', () => {
    it('should derive a key', async () => {
        let res = await pbkdf2({ password: Buffer.from('password'), salt: Buffer.from('salt'), bits: 256 });
        expect(res.toString('base64')).toBe('A5Si7eMyyaE+uC6bJGMWBMMd+Xi04vD70sVJlE+deaU=');
    });
});