import * as React from 'react';
import { View } from 'react-native';
import { createEmergencyKit } from '../../../auth/createEmergencyKit';
import { formatNormalizedSecretKey } from '../../../crypto/formatNormalizedSecretKey';
import { useApp } from '../../../storage/App';
import { Storage } from '../../../storage/Storage';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { Text } from '../../components/Themed';
import { Title } from '../../components/Title';
import { useCommand } from '../../components/useCommand';

export const Settings = React.memo(() => {

    const app = useApp();
    const username = app.storage.get('account:username') as string;
    const doDownloadEmergency = React.useCallback(async () => {

        // Load parameters
        let secretKey = app.storage.get('account:secret-key') as string;
        let username = app.storage.get('account:username') as string;
        let kit = await createEmergencyKit({ username, secretKey });

        // Download
        const blob = new Blob([kit], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const anchorElement = document.createElement('a');
        anchorElement.href = url;
        anchorElement.download = 'tactical-emergency-kit.pdf';
        anchorElement.target = "_blank";
        anchorElement.click();
        anchorElement.remove();
        URL.revokeObjectURL(url);

    }, []);
    const [executing, downloadAction] = useCommand(doDownloadEmergency);
    const [showSecret, setShowSecret] = React.useState(false);
    
    const doDisconnect = React.useCallback(async () => {
        await app.destroyAsync();
        Storage.reset();
        window.location.reload();
    }, []);
    const [executingDisconnect, diconnect] = useCommand(doDisconnect);

    return (
        <>
            <Header title="Settings" />
            <Content>
                <Section>
                    <Title title="Username" />
                    <span>@{username}</span>
                    <Text style={{ fontSize: 16, opacity: 0.6, marginTop: 8 }}>⚠️ Username can't be changed for security reasons</Text>
                </Section>
                <Section>
                    <Title title="Password" />
                    <Text style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>Change your account password</Text>
                    <span>(coming soon)</span>
                </Section>
                <Section>
                    <Title title="Secret Key" />
                    <View style={{ height: 48, justifyContent: 'center', flexDirection: 'column' }}>
                        {showSecret && <Text style={{ fontSize: 16, opacity: 0.9 }}>{formatNormalizedSecretKey(app.storage.get('account:secret-key') as string)}</Text>}
                        {!showSecret && <Button title="Reveal" onClick={() => setShowSecret(true)} />}
                    </View>
                </Section>
                <Section>
                    <Title title="Emergency Kit" />
                    <Text style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>Protect yourself from losing access to your account</Text>
                    <Button loading={executing} title="Download" onClick={downloadAction} />
                </Section>
                <Section>
                    <Title title="Disconnect" />
                    <Text style={{ fontSize: 16, lineHeight: 20, opacity: 0.9, marginBottom: 16 }}>Disconnecting your account won't delete it, but you will need your username, password and secret key to access it again.</Text>
                    <Button loading={executingDisconnect} title="Disconnect" onClick={diconnect} />
                </Section>
            </Content>
        </>
    );
});