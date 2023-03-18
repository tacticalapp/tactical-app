import * as React from 'react';
import { View } from 'react-native';
import { Maybe } from '../../utils/type';
import { Button } from './Button';
import { Modal, useModal } from './Modal';
import { Text } from './Themed';

export const ConfirmModal = React.memo((props: { title: string, message: any, action: string, danger?: Maybe<boolean>, onConfirm: (yes: boolean) => void }) => {
    const modal = useModal();
    return (
        <Modal title={props.title}>
            <View style={{ width: 400, marginTop: 32, marginBottom: 32 }}>
                <Text>{props.message}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 32 }}>
                <Button title="Cancel" onClick={() => { modal.close(modal.current); props.onConfirm(false) }} />
                <Button title={props.action} kind={props.action ? 'red' : 'normal'} onClick={() => { modal.close(modal.current); props.onConfirm(true) }} />
            </View>
        </Modal>
    )
});