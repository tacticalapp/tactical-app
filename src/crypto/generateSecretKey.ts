const KEY_SECTIONS = 6;
const KEY_SECTION_LENGTH = 5;
const characters = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', // 2-9
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', // A-H
    'J', 'K', 'L', 'M', 'N', // J-N
    'P', 'Q', 'R', 'S', 'T', // P-T
    'V', 'W', 'X', 'Y', 'Z', // V-Z
];

export function generateSecretKey() {
    let tmp = crypto.getRandomValues(Buffer.alloc(KEY_SECTIONS * KEY_SECTION_LENGTH));
    let res: string[] = [];
    for (let i = 0; i < KEY_SECTIONS; i++) {
        let s = '';
        for (let j = 0; j < KEY_SECTION_LENGTH; j++) {
            s += characters[(tmp[0] & 31)]; // total number of characters is 32
        }
        res.push(s);
    }
    return res.join('-');
}