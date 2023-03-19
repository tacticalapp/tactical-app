import * as React from 'react';
import * as Automerge from '@automerge/automerge';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { Title } from '../../components/Title';
import { useCommand } from '../../components/useCommand';
import { plafrorm } from '../../../utils/platform';
import { isMainnet } from '../../../utils/chain';
import { Select } from '../../components/Select';
import { TextInput } from '../../components/TextInput';

export const Dev = React.memo(() => {

    const app = useApp();
    const counterRef = app.live.get<{ counter: any }>('tmp.counter.N@', (d) => {
        d.counter = new Automerge.Counter();
    });
    const counter = counterRef.use();

    const wallets = app.wallets.use();

    let [selected, setSelected] = React.useState<string | null>(null);
    const walletOptions = React.useMemo(() => {
        let options: { label: string, value: string }[] = [];
        for (let w of Object.keys(wallets)) {
            options.push({ label: wallets[w].name, value: w });
        }
        return options;
    }, [wallets]);

    // const [executing, incrementAction] = useCommand(doIncrement);

    return (
        <>
            <Header title="Development" />
            <Content>
                <Section>
                    <Title title="Increment" />
                    <Button title={'Value: ' + counter.counter} onClick={() => counterRef.update((s) => s.counter.increment())} />
                </Section>
                <Section>
                    <Title title="Detected Platform" />
                    <span>{plafrorm}</span>
                </Section>
                <Section>
                    <Title title="Environment" />
                    <span>{isMainnet ? 'Mainnet' : 'Testnet'}</span>
                </Section>
                <Section>
                    <Title title="Select" />
                    <Select
                        value={selected}
                        options={walletOptions}
                        onChange={(e) => setSelected(e)}
                    />
                    <TextInput />
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