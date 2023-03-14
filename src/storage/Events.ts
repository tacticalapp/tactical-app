import { EventEmitter } from 'events';

export declare interface Events {
    on(event: 'cloud-key-changed', listener: (key: string, value: Buffer | null, seq: number) => void): this;
    on(event: 'live-key-changed', listener: (key: string, value: any) => void): this;
}

export class Events extends EventEmitter {

}