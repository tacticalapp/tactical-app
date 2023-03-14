import { getPublicKey } from '@noble/ed25519';
import axios from 'axios';
import * as z from 'zod';
import { sha256 } from '../crypto/primitives/sha256';
import { signPackage } from '../crypto/signPackage';

const challengeResponse = z.object({
    id: z.string(),
    kind: z.string(),
    params: z.string(),
    expires: z.number(),
    now: z.number()
});

const solveResponse = z.object({
    ok: z.literal(true),
});

const signupResponse = z.object({
    token: z.string(),
    package: z.string(),
    packageSignature: z.string(),
});

const loginResponse = z.object({
    token: z.string(),
    package: z.string(),
    packageSignature: z.string(),
});

const usernameResponse = z.object({
    valid: z.boolean(),
    available: z.boolean()
});

const timeResponse = z.object({
    time: z.number(),
})

export class TacticalClient {

    readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getTime() {
        let res = await axios.get(this.endpoint + '/public/time', { timeout: 5000 });
        let parsed = timeResponse.safeParse(res.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data.time;
    }

    async checkTime() {
        let delta = Math.floor(Date.now() / 1000) - await this.getTime();
        console.warn(delta);
        return Math.abs(delta) <= 60 * 5; // 5 minutes
    }

    async requestChallenge() {
        let res = await this.#doRequest('/auth/challenge', {});
        let parsed = challengeResponse.safeParse(res.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async solve(id: string, solution: string) {
        let res = await this.#doRequest('/auth/solve', { id, solution });
        let parsed = solveResponse.safeParse(res.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
    }

    async signup(publicKey: Buffer, packageData: Buffer, packageSignature: Buffer, username: string, challenge: string, challengeSignature: Buffer) {
        let res = await this.#doRequest('/auth/signup', {
            publicKey: publicKey.toString('base64'),
            package: packageData.toString('base64'),
            packageSignature: packageSignature.toString('base64'),
            username,
            challenge,
            challengeSignature: challengeSignature.toString('base64'),
        }, [200, 403]);
        if (res.status === 200) {
            let parsed = signupResponse.safeParse(res.data);
            if (!parsed.success) {
                throw new Error("Invalid response");
            }
            return { ok: true as const, response: parsed.data } as const;
        } else {
            return { ok: false as const, error: res.data.error as string } as const;
        }
    }

    async login(username: string, challenge: string, challengeSignature: Buffer) {
        let res = await this.#doRequest('/auth/login', {
            username,
            challenge,
            challengeSignature: challengeSignature.toString('base64'),
        }, [200, 403]);
        if (res.status === 200) {
            let parsed = loginResponse.safeParse(res.data);
            if (!parsed.success) {
                throw new Error("Invalid response");
            }
            return { ok: true as const, response: parsed.data } as const;
        } else {
            return { ok: false as const, error: res.data.error as string } as const;
        }
    }

    async checkUsername(username: string) {
        let res = await this.#doRequest('/auth/username', { username });
        let parsed = usernameResponse.safeParse(res.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async #doRequest(path: string, data: any, statuses: number[] = [200]) {
        let r = await axios.post(this.endpoint + path, data, {
            validateStatus(status) {
                return statuses.includes(status);
            },
            timeout: 5000
        });
        return r;
    }
}

const meResponse = z.object({
    username: z.string()
});

const keysResponse = z.object({
    entries: z.array(z.object({
        seq: z.number(),
        key: z.string(),
        value: z.string().nullable(),
    }))
});

const updateResponse = z.object({
    seq: z.number(),
    key: z.string(),
    value: z.string().nullable(),
});

const changesResponse = z.object({
    seq: z.number(),
    changes: z.array(z.object({ seq: z.number(), key: z.string() }))
});

export class TacticalAccountClient {

    #endpoint: string;
    #privateKey: Buffer;

    constructor(endpoint: string, token: Buffer) {
        this.#endpoint = endpoint;
        this.#privateKey = token;
    }

    async getMe() {
        let r = await this.#doRequest('/account/me', {});
        let parsed = meResponse.safeParse(r.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async getKeys(encryptedKeys: string[]) {
        let r = await this.#doRequest('/storage/get', { keys: encryptedKeys });
        let parsed = keysResponse.safeParse(r.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data.entries;
    }

    async getChanges(seq: number) {
        let r = await this.#doRequest('/storage/changes', { seq });
        let parsed = changesResponse.safeParse(r.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async updateKey(key: string, value: string | null, seq: number | null) {
        let r = await this.#doRequest('/storage/update', { key, value, seq }, [200, 409]);
        let parsed = updateResponse.safeParse(r.data);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        if (r.status === 409) {
            return { status: 'conflict' as const, ...parsed.data };
        } else {
            return { status: 'ok' as const, ...parsed.data };
        }
    }

    async #doRequest(path: string, data: any, statuses: number[] = [200]) {

        // Prepare request
        let body = JSON.stringify(data);
        let time = Math.floor(Date.now() / 1000);
        let bodyHash = await sha256(Buffer.from(body));
        let pk = Buffer.from(await getPublicKey(this.#privateKey));
        let signingBody = [
            path,
            bodyHash.toString('hex'),
            time.toString(),
        ].join('\n');
        let signed = await signPackage(Buffer.from(signingBody), this.#privateKey);

        // Send request
        let response = await axios.post(this.#endpoint + path, body, {
            headers: {
                'Content-Type': 'application/json',
                ['X-Tactical-Time']: time,
                ['X-Tactical-Token']: pk.toString('base64'),
                ['X-Tactical-Signature']: signed.toString('base64'),
            },
            validateStatus(status) {
                return statuses.includes(status);
            },
            timeout: 5000
        });
        return response;
    }
}