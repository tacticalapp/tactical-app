import tc from 'tweetnacl';
import { randomBytes } from './randomBytes';

export function encrypt(key: Buffer, data: Buffer) {
    let nonce = randomBytes(tc.secretbox.nonceLength);
    return Buffer.concat([nonce, tc.secretbox(data, nonce, key)]);
}