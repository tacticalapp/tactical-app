export function normalizeUsername(src: string) {
    let s = src.trim();
    if (s.startsWith('@')) {
        s = s.substring(1);
    }
    return s;
}