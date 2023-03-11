export function randomBytes(size: number) {
    let res = new Uint8Array(size);
    crypto.getRandomValues(res);
    return Buffer.from(res);
}