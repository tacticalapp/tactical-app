import * as React from 'react';
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Transport, { Subscription } from '@ledgerhq/hw-transport';
import { TonTransport } from 'ton-ledger';
import { TransportOpenUserCancelled } from '@ledgerhq/errors';

export function useDevice() {
    const [device, setDevice] = React.useState<{ kind: 'waiting' } | { kind: 'transport', transport: TonTransport } | { kind: 'error', error: 'unknown' | 'user-cancelled' }>({ kind: 'waiting' } );
    React.useEffect(() => {
        let exited = false;
        let transport: Transport | null = null;
        let subscription: Subscription = TransportWebHID.listen({
            next: (e) => {
                (async () => {
                    try {
                        let dev = await TransportWebHID.open(e.descriptor);
                        if (exited) {
                            exited = true;
                            await dev.close();
                        } else {
                            transport = dev;
                        }

                        let tr = new TonTransport(dev);
                        setDevice({ kind: 'transport', transport: tr });
                        exited = true;
                    } catch (e) {
                        if (!exited) {
                            setDevice({ kind: 'error', error: 'unknown' });
                            exited = true;
                        }
                    }
                })();
            },
            error: (e) => {
                if (!exited) {
                    console.warn(e);
                    if (e instanceof TransportOpenUserCancelled) {
                        setDevice({ kind: 'error', error: 'user-cancelled' });
                    } else {
                        setDevice({ kind: 'error', error: 'unknown' });
                    }
                    exited = true;
                }
            },
            complete: () => {
                // Ignore
            }
        });
        return () => {
            exited = true;
            if (transport) {
                try {
                    transport.close();
                } catch (e) {
                    // Ignore
                }
            }
            try {
                subscription.unsubscribe();
            } catch (e) {
                // Ignore
            }
        };
    }, []);
    return device;
}