import { useAnimationControls, motion } from 'framer-motion';
import * as React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { Address } from 'ton-core';
import { isMainnet } from '../../../utils/chain';
import { shake } from '../../../utils/shake';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { TextInput } from '../../components/TextInput';

export const SearchFragment = React.memo(() => {
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
            <Header title="Explorer" />
            <Content style={{ justifyContent: 'center', paddingBottom: 110 }}>
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
            </Content>
        </>
    );
});