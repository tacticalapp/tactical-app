import * as React from 'react';
import Transport from '@ledgerhq/hw-transport';
import { LockedDeviceError, TransportStatusError } from '@ledgerhq/errors';
import TransportWeb from "@ledgerhq/hw-transport-webusb";
import { AsyncLock } from '../../utils/lock';
import { delay, retry } from '../../utils/time';
import { getAppAndVersion, openApp, quitApp } from './commands';
import { TonTransport } from 'ton-ledger';

const lock = new AsyncLock();

type ActionState = {
    kind: 'await-device'
} | {
    kind: 'await-app'
} | {
    kind: 'executing'
} | {
    kind: 'failed'
} | {
    kind: 'canceled'
} | {
    kind: 'completed'
};

export function useLedgerAction<T>(action: (transport: TonTransport) => Promise<T>) {
    const [state, setState] = React.useState<ActionState>({ kind: 'await-device' });

    React.useEffect(() => {
        let exited = false;
        retry(async () => {
            await lock.inLock(async () => {
                if (exited) {
                    return;
                }

                // Trying to find transport
                let transport = await TransportWeb.create();
                if (exited) {
                    await transport.close();
                    return;
                }

                try {

                    // Request app to be open
                    while (!exited) {
                        try {
                            let current = await getAppAndVersion(transport);
                            if (exited) {
                                return;
                            }
                            if (current.name !== 'TON') {
                                setState({ kind: 'await-app' });
                                if (current.name === 'BOLOS') {
                                    await openApp(transport, 'TON');
                                } else {
                                    await quitApp(transport);
                                }
                            } else {
                                break;
                            }
                        } catch (e) {
                            if (!(e instanceof LockedDeviceError)) { // Ignore locked device state
                                if (e instanceof TransportStatusError && (e as any).statusCode === 0x5501) {
                                    setState({ kind: 'canceled' });
                                    return;
                                }
                                throw e;
                            } else {
                                await delay(1000); // Wait for device to be unlocked
                            }
                        }
                    }
                    if (exited) {
                        return;
                    }

                    // Execution
                    setState({ kind: 'executing' });
                    try {
                        await action(new TonTransport(transport));
                    } catch (e) {
                        console.warn(e);
                        if (exited) {
                            return;
                        }
                        setState({ kind: 'failed' });
                    }
                    return;
                } finally {
                    await transport.close();
                }
            });
        })

        return () => {
            exited = true;
        };
    }, [action]);

    return state;
}