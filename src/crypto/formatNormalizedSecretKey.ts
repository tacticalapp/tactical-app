export function formatNormalizedSecretKey(src: string) {
    if (src.length === 25) {
        return src.slice(0, 5) + '-' + src.slice(5, 10) + '-' + src.slice(10, 15) + '-' + src.slice(15, 20) + '-' + src.slice(20, 25);
    }
    return src;
}