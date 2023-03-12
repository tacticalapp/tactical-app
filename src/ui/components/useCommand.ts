import * as React from 'react';

export function useCommand(command: () => Promise<void>): [boolean, () => void] {

    let [executing, setExecuting] = React.useState(false);;
    let execute = React.useCallback(() => {
        if (executing) return;
        setExecuting(true);
        command().finally(() => setExecuting(false));
    }, [command, executing]);

    return [executing, execute];
}