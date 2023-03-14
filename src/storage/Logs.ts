export class Logs {
    cloudKeyUpdated(key: string, seq: number): void {
        console.log(`[cloud] updated: ${key} (${seq})`);
    }
    cloudChanges(keys: string[], seq: number) {
        console.log(`[cloud] changes: ${keys.join(',')} (${seq})`);
    }
}