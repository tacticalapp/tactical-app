export async function solveHashChallenge(params: string) {
    let pp = params.split(',', 2);
    let target = Buffer.from(pp[0], 'base64');
    let salt = Buffer.from(pp[1], 'base64');
    while (true) {
        let nonce = crypto.getRandomValues(new Uint8Array(32));
        let hash = await crypto.subtle.digest('SHA-256', Buffer.concat([nonce, salt]));
        if (Buffer.from(hash).compare(target) <= 0) {
            return Buffer.concat([nonce, salt]).toString('base64');
        }
    }
}