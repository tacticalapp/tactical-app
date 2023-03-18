import * as React from 'react';
import { Image, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { useModal } from '../../components/Modal';
import { ConnectModal } from '../connect/ConnectModal';
import iconWallets from '../../../assets/sidebar_wallets.svg';
import { Text } from '../../components/Themed';
import { css } from '@linaria/core';
import iconLedger from '../../../assets/icon_ledger.svg';
import iconKeeper from '../../../assets/icon_keeper.svg';
import { AddressComponent } from '../../components/AddressComponent';
import { SearchFragment } from '../explorer/SearchFragment';
import { Section } from '../../components/Section';
import { Title } from '../../components/Title';

const buttonStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1D1D1D;
    border-width: 0px;
    border-radius: 10px;
    height: 62px;
    padding: 0px;
    margin: 0px;
    padding-left: 16px;
    width: 300px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

const container = css`
    padding-left: 10px;
    flex-basis: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const iconClass = css`
    width: 32px;
    height: 32px;
`;

const WalletButton = React.memo((props: { kind: 'ledger' | 'mobile', address: string, name: string }) => {
    const navigate = useNavigate();
    const doNavigate = React.useCallback(() => {
        navigate(`/explorer/${props.address}`);
    }, [props.address]);
    return (
        <button onClick={doNavigate} className={buttonStyle}>
            <img className={iconClass} src={props.kind === 'ledger' ? iconLedger : iconKeeper} />
            <View style={{ flexDirection: 'column', flexGrow: 1, flexBasis: 0, paddingLeft: 10, paddingRight: 16, gap: 2 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: '600', fontSize: 15, lineHeight: 20, textAlign: 'left' }}>{props.name}</Text>
                <AddressComponent address={props.address} style={{ fontWeight: '400', fontSize: 12, opacity: 0.4, textAlign: 'left' }} maxLength={26} />
            </View>
        </button>
    );
});

export const Wallets = React.memo(() => {

    const app = useApp();
    const wallets = app.wallets.use();
    const modal = useModal();
    const doAddNewWallet = React.useCallback(() => {
        modal.show(<ConnectModal />);
    }, []);
    let addresses = Object.keys(wallets);
    addresses.sort((a, b) => wallets[a].name.localeCompare(wallets[b].name));

    return (
        <>
            <Header title="Wallets" right={<Button title="Connect" onClick={doAddNewWallet} />} />
            <Content>
                {addresses.length === 0 && (
                    <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={{ uri: iconWallets }} style={{ width: 48, height: 48, opacity: 0.5 }} />
                        <Text style={{ width: 300, textAlign: 'center', fontWeight: '600', fontSize: 16, lineHeight: 24, marginTop: 14, opacity: 0.5 }}>
                            Connect you existing TON Wallet by pressing "Connect"
                        </Text>
                    </View>
                )}
                {addresses.length > 0 && (
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16 }}>
                        {addresses.map((address) => (
                            <WalletButton
                                key={address}
                                address={address}
                                name={wallets[address].name}
                                kind={wallets[address].config.kind === 'ledger' ? 'ledger' : 'mobile'}
                            />
                        ))}
                    </View>
                )}
            </Content>
        </>
    );
});