import * as React from 'react';
import { WalletContract } from '../../../../resolvers/contracts/resolveWallet';
import { Section } from '../../../components/Section';
import { Title } from '../../../components/Title';

export const WalletView = React.memo((props: { src: WalletContract }) => {
    return (
        <Section>
            <Title title="Contract Type" />
            <span>Wallet {props.src.version}</span>
        </Section>
    );
});