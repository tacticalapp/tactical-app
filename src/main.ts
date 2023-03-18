import { app, BrowserWindow, HIDDevice, shell } from 'electron';
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
        minWidth: 1024,
        minHeight: 550,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#111111',
        // ...(process.platform === 'darwin' ? {
        //     transparent: true,
        //     vibrancy: 'sidebar',
        //     visualEffectState: "followWindow",
        //     backgroundColor: "#00000000",
        // } : {
        //     backgroundColor: '#111111',
        // }),

        trafficLightPosition: {
            x: 14,
            y: 18,
        },
        show: false,
        paintWhenInitiallyHidden: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    // WebHID device selection
    mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
        console.log('select-hid-device', event, details);

        // Opener
        let opened = false;
        let devices: HIDDevice[] = details.deviceList;
        function tryOpen() {
            if (opened) {
                return;
            }

            // Find ledger
            let ledgers = devices.filter((v) => v.vendorId === 0x2c97);
            if (ledgers.length > 0) {
                opened = true;
                callback(ledgers[0].deviceId);
            }
        }

        // Add events to handle devices being added or removed before the callback on
        //`select-hid-device` is called.
        mainWindow.webContents.session.on('hid-device-added', (event, device) => {
            console.log('hid-device-added FIRED WITH', device);
            devices.push(device.device as any); // Typings error
            tryOpen();
        });

        mainWindow.webContents.session.on('hid-device-removed', (event, device) => {
            console.log('hid-device-removed FIRED WITH', device);
            //Optionally update details.deviceList
        });

        // Call with default device
        event.preventDefault();

        // Ledgers
        tryOpen();
    })

    // Permissions
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
        return true;
    });
    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        return true;
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
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

