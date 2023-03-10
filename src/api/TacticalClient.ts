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
});

export class TacticalClient {

    readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async requestChallenge() {
        let res = await this.#doRequest('/auth/challenge', {});
        let parsed = challengeResponse.safeParse(res);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async solve(id: string, solution: string) {
        let res = await this.#doRequest('/auth/solve', { id, solution });
        let parsed = solveResponse.safeParse(res);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
    }

    async signup(publicKey: Buffer, packageData: Buffer, packageSignature: Buffer, username: string, challenge: string) {
        let res = await this.#doRequest('/auth/signup', {
            publicKey: publicKey.toString('base64'),
            package: packageData.toString('base64'),
            packageSignature: packageSignature.toString('base64'),
            username,
            challenge
        });
        let parsed = signupResponse.safeParse(res);
        if (!parsed.success) {
            throw new Error("Invalid response");
        }
        return parsed.data;
    }

    async #doRequest(path: string, data?: any) {
        let r = await axios.post(this.endpoint + path, data);
        return r.data;
    }
}