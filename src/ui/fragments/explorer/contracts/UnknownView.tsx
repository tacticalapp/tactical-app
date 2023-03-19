import * as React from 'react';
import { Address } from 'ton-core';
import { Section } from '../../../components/Section';
import { Title } from '../../../components/Title';

export const UnknownView = React.memo((props: { address: Address, message: string }) => {
    return (
        <Section>
            <Title title="Contract Type" />
            <span>{props.message}</span>
        </Section>
    );
});