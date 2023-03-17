import Transport from "@ledgerhq/hw-transport";

// SOURCE: https://github.com/LedgerHQ/ledger-live/blob/6abe8dd35b103253650f93080b105286afbac4c2/libs/ledger-live-common/src/hw/getDeviceName.ts#L6
// NOTE: This could work only when app is NOT open
export async function getDeviceName(transport: Transport) {

    // NB Prevents bad apdu response for LNX
    await transport.send(0xe0, 0x50, 0x00, 0x00).catch(() => { });

    // Send command
    const res = await transport.send(0xe0, 0xd2, 0x00, 0x00, Buffer.from([]));

    // Check response
    return res.subarray(0, res.length - 2).toString("utf-8");
}

// SOURCE: https://github.com/LedgerHQ/ledger-live/blob/6abe8dd35b103253650f93080b105286afbac4c2/libs/ledger-live-common/src/hw/openApp.ts#L2
// NOTE: This could work only when app is NOT open
export async function openApp(transport: Transport, name: string) {
    await transport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from(name, "ascii"));
};

// SOURCE: https://github.com/LedgerHQ/ledger-live/blob/6abe8dd35b103253650f93080b105286afbac4c2/libs/ledger-live-common/src/hw/quitApp.ts#L2
export async function quitApp(transport: Transport) {
    await transport.send(0xb0, 0xa7, 0x00, 0x00);
};

// SOURCE: https://github.com/LedgerHQ/ledger-live/blob/6abe8dd35b103253650f93080b105286afbac4c2/libs/ledger-live-common/src/hw/getAppAndVersion.ts#L3
export async function getAppAndVersion(transport: Transport) {
    const r = await transport.send(0xb0, 0x01, 0x00, 0x00);
    let i = 0;
    const format = r[i++];

    if (format !== 1) {
        throw new Error("invalid format");
    }

    const nameLength = r[i++];
    const name = r.slice(i, (i += nameLength)).toString("ascii");
    const versionLength = r[i++];
    const version = r.slice(i, (i += versionLength)).toString("ascii");
    const flagLength = r[i++];
    const flags = r.slice(i, (i += flagLength));
    return {
        name,
        version,
        flags,
    };
}