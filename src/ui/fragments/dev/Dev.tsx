import * as React from 'react';
import { createEmergencyKit } from '../../../auth/createEmergencyKit';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { Title } from '../../components/Title';
import { useCommand } from '../../components/useCommand';

export const Dev = React.memo(() => {

    const app = useApp();
    const doIncrement = React.useCallback(async () => {
            let res = await app.cloud.readValue('tmp.hello2');
            let counter = 0;
            if (res.value) {
                counter = res.value.readUint32BE(0);
            }

            console.warn(counter);

            counter++;

            // Write back
            let b = Buffer.alloc(4);
            b.writeUInt32BE(counter, 0);

            // Write back
            await app.cloud.writeValue('tmp.hello2', b);

    }, []);
    const [executing, incrementAction] = useCommand(doIncrement);

    return (
        <>
            <Header title="Development" />
            <Content>
                <Section>
                    <Title title="Increment" />
                    <Button loading={executing} title="Download" onClick={incrementAction} />
                </Section>
                {/* <Section>
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
                    <Title title="Emergency Kit" />
                    <Text style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>Protect yourself from losing access to your account</Text>
                    <Button loading={executing} title="Download" onClick={downloadAction} />
                </Section>
                <Section>
                    <Title title="Exit" />
                    <span>Some exit</span>
                </Section> */}
            </Content>
        </>
    );
});