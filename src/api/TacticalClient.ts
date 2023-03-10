import axios from 'axios';
import * as z from 'zod';

const challengeResponse = z.object({
    id: z.string(),
    kind: z.string(),
    params: z.string(),
    expires: z.number(),
    now: z.number()
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
            throw new Error("Invalid challenge response");
        }
        return parsed.data;
    }

    async #doRequest(path: string, data?: any) {
        let r = await axios.post(this.endpoint + path, data);
        return r.data;
    }
}