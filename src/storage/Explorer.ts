import { App } from "./App";
import { LiveValue } from "./LiveValue";

export type ExplorerType = {
    last: string[]
};

export class Explorer {

    readonly app: App;

    #live: LiveValue<ExplorerType>;

    constructor(app: App) {
        this.app = app;
        this.#live = app.live.get<ExplorerType>('explorer', (src) => {
            src.last = [] as any;
        });
    }

    visited(address: string) {
        this.#live.update((data) => {

            // Remove existing
            let ex = data.last.findIndex((v) => v === address);
            if (ex === 0) {
                // Nothing to do
                return;
            }

            // Add to the top
            if (ex > 0) {
                data.last.splice(ex, 1);
            }
            data.last.unshift(address);

            // Trim
            while (data.last.length > 10) {
                data.last.pop();
            }
        });
    }

    use() {
        return this.#live.use();
    }
}