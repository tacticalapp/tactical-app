import * as React from 'react';

export async function createEmergencyKit(args: { username: string, secretKey: string }) {

    // Dynamic import
    let imported = await import('@react-pdf/renderer');
    let { Document, Page, Text, pdf } = imported;

    // Render PDF
    const doc = (
        <Document
            title={'Tactical Emergency Kit @' + args.username}
        >
            <Page
                size={"ID1"}
                orientation="landscape"
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#E4E4E4',
                    padding: 16,
                    fontSize: 10
                }}
            >

                <Text>Tactical Emergency Kit</Text>
                <Text>Username: {args.username}</Text>
                <Text>Secret Key: {args.secretKey}</Text>
                <Text>Password: </Text>
            </Page>
        </Document>
    );
    return Buffer.from(await (await pdf(doc).toBlob()).arrayBuffer());
}