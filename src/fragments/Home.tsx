import * as React from 'react';
import { client } from '../api/client';
import { TacticalAccountClient } from '../api/TacticalClient';
import { useStorage } from '../storage/useStorage';

export const Home = React.memo(() => {
    const storage = useStorage();
    React.useEffect(() => {
        (async () => {
            const key = Buffer.from(storage.get('account:token') as string, 'base64');
            const accountClient = new TacticalAccountClient(client.endpoint, key);
            await accountClient.getMe();
            
        })();
    }, []);
    return null;
});