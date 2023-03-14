import { deriveSymmetricPath } from "ton-crypto";
import * as tc from 'tweetnacl';

async function deriveKeyEncryption(secret: Buffer) {
    return await deriveSymmetricPath(secret, ['content', 'key']);
}

async function deriveNonce(secret: Buffer) {
    return (await deriveSymmetricPath(secret, ['content', 'nonce'])).subarray(0, 24);
}

async function deriveValueEncryption(secret: Buffer, key: string) {
    return await deriveSymmetricPath(secret, ['content', 'value', key]);
}

async function deriveValueNonce(secret: Buffer, key: string) {
    return (await deriveSymmetricPath(secret, ['content', 'value-nonce', key])).subarray(0, 24);
}

export async function contentKeyEncrypt(args: { key: string, secret: Buffer }) {
    let keyEncryption = await deriveKeyEncryption(args.secret);
    let keyNonce = await deriveNonce(args.secret);
    let key = Buffer.from(tc.secretbox(Buffer.from(args.key), keyNonce, keyEncryption)).toString('base64');
    return key;
}

export async function contentEncrypt(args: { key: string, value: Buffer, secret: Buffer }) {

    // Encrypt key
    let keyEncryption = await deriveKeyEncryption(args.secret);
    let keyNonce = await deriveNonce(args.secret);
    let key = Buffer.from(tc.secretbox(Buffer.from(args.key), keyNonce, keyEncryption)).toString('base64');

    // Encrypt value
    let valueEncryption = await deriveValueEncryption(args.secret, args.key);
    let valueNonce = await deriveValueNonce(args.secret, args.key);
    let value = Buffer.from(tc.secretbox(args.value, valueNonce, valueEncryption)).toString('base64');
    return {
        key,
        value
    };
}

export async function contentKeyDecrypt(args: { key: string, secret: Buffer }) {

    // Load key
    let keyEncryption = await deriveKeyEncryption(args.secret);
    let keyNonce = await deriveNonce(args.secret);
    let keyB = tc.secretbox.open(Buffer.from(args.key, 'base64'), keyNonce, keyEncryption);
    if (!keyB) {
        return null;
    }
    let key = Buffer.from(keyB).toString();
    return key;
}


export async function contentDecrypt(args: { key: string, value: string, secret: Buffer }) {

    // Load key
    let keyEncryption = await deriveKeyEncryption(args.secret);
    let keyNonce = await deriveNonce(args.secret);
    let keyB = tc.secretbox.open(Buffer.from(args.key, 'base64'), keyNonce, keyEncryption);
    if (!keyB) {
        return null;
    }
    let key = Buffer.from(keyB).toString();

    // Load value
    let valueEncryption = await deriveValueEncryption(args.secret, key);
    let valueNonce = await deriveValueNonce(args.secret, key);
    let valueB = tc.secretbox.open(Buffer.from(args.value, 'base64'), valueNonce, valueEncryption);
    if (!valueB) {
        return null;
    }
    let value = Buffer.from(valueB);

    return {
        key,
        value
    };
}
