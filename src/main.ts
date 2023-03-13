import { app, BrowserWindow } from 'electron';
import path from 'path';
declare const MAIN_WINDOW_VITE_NAME: string;
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;

// 
// Handle Updater
//

if (require('electron-squirrel-startup')) {
    app.quit();
}

//
// Window Creation
//

const createWindow = (): void => {
    
    //
    // Create the browser window.
    //
    
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1024,
        minWidth: 450,
        minHeight: 550,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#111111',
        trafficLightPosition: {
            x: 14,
            y: 18,
        },
        webPreferences: {

            // preload: PRELOAD_VITE_NAME,
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/\${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

//
// Window Lifecycle
//

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

