export function normalizePassword(src: string) {
    return src.trim().normalize('NFKD');
}