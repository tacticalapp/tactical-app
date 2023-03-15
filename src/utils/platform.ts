declare const electron: any;

export const plafrorm: 'web' | 'macos' | 'win' = (() => {

    // Electron
    if (typeof electron !== 'undefined' && electron.__is_electron === true) {
        if (electron.platform === 'darwin') {
            return 'macos';
        } else if (electron.platform === 'win32') {
            return 'win';
        }
    }

    // Browser
    return 'web';
})();