export function bigintToBuffer(value: bigint): Buffer {
    let hex = value.toString(16);
    while (hex.length < 64) {
        hex = '0' + hex;
    }
    return Buffer.from(hex, 'hex');
}