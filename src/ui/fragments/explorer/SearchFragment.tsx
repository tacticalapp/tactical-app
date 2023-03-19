import { useAnimationControls, motion } from 'framer-motion';
import * as React from 'react';
import { View } from 'react-native';
import { Link, useNavigate } from 'react-router-dom';
import { Address } from 'ton-core';
import { useApp } from '../../../storage/App';
import { isMainnet } from '../../../utils/chain';
import { shake } from '../../../utils/shake';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { TextInput } from '../../components/TextInput';
import { Title } from '../../components/Title';

export const SearchFragment = React.memo(() => {
    const app = useApp();
    const recent = app.explorer.use();
    const [search, setSearch] = React.useState('');
    const searchControls = useAnimationControls();
    const navigate = useNavigate();
    const doSearch = () => {

        // Check address
        let address: Address;
        try {
            address = Address.parse(search);
        } catch (e) {
            shake(searchControls);
            return;
        }

        // Navigate to address
        navigate(`/explorer/${address.toString({ testOnly: !isMainnet })}`);
    };
    return (
        <>
            <Content style={{ justifyContent: 'center' }}>
                <View style={{ flexGrow: 0.5, flexBasis: 0, alignSelf: 'center' }} />
                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <motion.div animate={searchControls}>
                        <TextInput
                            placeholder="Enter TON Address"
                            style={{ width: 400, marginRight: 16 }}
                            value={search}
                            onChangeText={setSearch}
                            blurOnSubmit={false}
                            onSubmitEditing={doSearch}
                        />
                    </motion.div>
                    <Button
                        title="Search"
                        size="large"
                        onClick={doSearch}
                    />
                </View>
                <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'center' }}>
                    {recent.last.length > 0 && (
                        <Title title="Recent" />
                    )}
                    {recent.last.map((v) => (
                        <Link key={v} to={'/explorer/' + v}><AddressComponent address={v} /></Link>
                    ))}
                </View>
            </Content>
        </>
    );
});