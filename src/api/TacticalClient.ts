import axios from 'axios';
import * as z from 'zod';

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

const usernameResponse = z.object({
    valid: z.boolean(),
    available: z.boolean()
});

export class TacticalClient {

    readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
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
        });
        return r;
    }
}