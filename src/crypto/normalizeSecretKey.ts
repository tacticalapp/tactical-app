export function normalizeSecretKey(src: string) {
    return src.trim()
        .replace(/-/g, '')
        .replace(/\s/g, '')
        .toUpperCase();
}