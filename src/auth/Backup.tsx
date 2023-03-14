import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from '../ui/components/Themed';
import { Storage } from '../storage/Storage';
import Balancer from 'react-wrap-balancer';
import { createEmergencyKit } from './createEmergencyKit';
import { Button } from '../ui/components/Button';
import { useCommand } from '../ui/components/useCommand';
import { App } from '../storage/App';

export const Backup = React.memo((props: { storage: Storage, password: string, onReady: (app: App) => void }) => {

    const secretKey = React.useMemo(() => props.storage.get('account:secret-key') as string, []);
    const username = React.useMemo(() => props.storage.get('account:username') as string, []);
    const [emergencyKit, setEmergencyKit] = React.useState<Buffer | null>(null);
    React.useEffect(() => {
        let exited = false;
        (async () => {
            let kit = await createEmergencyKit({ username, secretKey })
            if (!exited) {
                setEmergencyKit(kit);
            }
        })()
        return () => {
            exited = true;
        }
    }, []);
    const doDownload = React.useCallback(() => {
        if (!emergencyKit) {
            return;
        }

        // Download file
        const blob = new Blob([emergencyKit], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const anchorElement = document.createElement('a');
        anchorElement.href = url;
        anchorElement.download = 'tactical-emergency-kit.pdf';
        anchorElement.target = "_blank";
        anchorElement.click();
        anchorElement.remove();
        URL.revokeObjectURL(url);

    }, [emergencyKit]);
    const doComplete = React.useCallback(async () => {

        // Commit storage
        await props.storage.attach();

        //
        // Simplify development
        //

        if (import.meta.env.DEV) {
            localStorage.setItem('__dev__password__', props.password);
        }

        // Done
        props.onReady(await App.create(props.storage));
    }, []);
    const [executing, executingAction] = useCommand(doComplete);

    return (
        <View style={{ flexGrow: 1, width: 336, justifyContent: 'center', alignItems: 'stretch' }}>
            <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: '400', marginTop: 16, textAlign: 'center', marginBottom: 18 }}>
                🔐 Backup your account
            </Text>

            <Text style={{ fontSize: 14, lineHeight: 21, textAlign: 'center', alignSelf: 'stretch' }}>
                <Balancer>
                    Secret key is <Text style={{ fontWeight: '800' }}>required</Text> to access your account.
                    Losing it would result in <Text style={{ fontWeight: '800' }}>permanent loss</Text> of access to the Tactical account.
                </Balancer>
            </Text>

            <Text
                style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginTop: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 18,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 4,
                }}
                numberOfLines={1}
            >
                {secretKey}
            </Text>

            <Text style={{ fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 24, marginBottom: 36 }}>
                <Balancer>
                    Tactical <Text style={{ fontWeight: '800' }}>doesn't</Text> have keys from your funds and losing <br /> this key would <Text style={{ fontWeight: '800' }}>not</Text> result in loss of funds.
                </Balancer>
            </Text>

            <View style={{ height: 48, width: 300, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                {emergencyKit && <Button title="Download emergency kit" kind={'green'} onClick={doDownload} />}
                {!emergencyKit && <ActivityIndicator color={"white"} />}
            </View>

            <View style={{ height: 48, marginTop: 24, width: 300, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Button title="Complete account creation" kind={'normal'} loading={executing} onClick={executingAction} />
            </View>
        </View>
    );
});