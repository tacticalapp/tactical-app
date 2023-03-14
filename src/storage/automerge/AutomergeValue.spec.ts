import { AutomergeValue } from "./AutomergeValue";
import * as Automerge from '@automerge/automerge';

describe('AutomergeValue', () => {
    it('should create initial document', () => {

        // Create initial document
        let v = AutomergeValue.fromEmpty<{ installer: any }>('0000', (s) => { s.installer = {} });
        expect(Automerge.getAllChanges(v.value).length).toBe(1);

        // Create initial document without changes
        v = AutomergeValue.fromEmpty<{ installer: any }>('0000', (s) => { });
        expect(Automerge.getAllChanges(v.value).length).toBe(0);
    });
    it('should merge documents', () => {

        // Create initial documen
        let v1 = AutomergeValue.fromEmpty<{ installer: any }>('0001', (s) => { s.installer = {} });
        let v2 = AutomergeValue.fromEmpty<{ installer: any }>('0000', (s) => { s.installer = {} });

        // Update documents
        v1.update((t) => t.installer.foo = 'bar2');
        v2.update((t) => t.installer.foo = 'bar');

        // Merge documents (with conflicts)
        v1.apply(v2);
        v2.apply(v1);

        // Check result
        expect(v1.value.installer.foo).toEqual(v2.value.installer.foo);
    });
});