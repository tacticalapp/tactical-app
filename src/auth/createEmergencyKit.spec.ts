import { createEmergencyKit } from './createEmergencyKit';
import * as fs from 'fs';

describe('createEmergencyKit', () => {
    it('should create an emergency kit', async () => {
        const kit = await createEmergencyKit({ username: 'steve', secretKey: '12312312312312312' });
        fs.writeFileSync(__dirname + '/createEmergencyKit.pdf', kit);
    });
});