export async function sha256(src: Buffer) {
    return Buffer.from(await crypto.subtle.digest("SHA-256", src));
}