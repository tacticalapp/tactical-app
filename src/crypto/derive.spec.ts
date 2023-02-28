import { derive } from "./derive";

describe('derive', () => {
    it('should derive a key', async () => {
        let res = await derive({ data: 'password', salt: 'salt' });
        expect(res.toString('base64')).toMatchSnapshot();
    });
});