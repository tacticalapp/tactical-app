import * as React from 'react';
import { Storage } from './Storage';

export const StorageContext = React.createContext<Storage | null>(null);

export function useStorage() {
    const storage = React.useContext(StorageContext);
    if (!storage) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return storage;
}