import { app, BrowserWindow, ipcMain, shell } from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = 'true';


const createWindow = (): void => {

    let width: number;
    if (process.env.NODE_ENV == 'development') {
        width = 1200;
    }
    else {
        width = 496;
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        titleBarStyle: "hidden",
        width: width,
        height: 659,
        backgroundColor: "white",
        resizable: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools when developing
    if (process.env.NODE_ENV == 'development') {
        mainWindow.webContents.openDevTools();
    }
  
    // Intercept a click on anchor (ideally with `target="_blank"`)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        handleUrl(url);
        return { action: 'deny' }; // Prevent the app from opening the URL
    });
    
    const handleUrl = async (url: string) => {

        const parsedUrl = maybeParseUrl(url);
        if (!parsedUrl) return;
    
        const { protocol } = parsedUrl;

        // Open URL in user's browser
        if (protocol === 'http:' || protocol === 'https:') {
            try {
                await shell.openExternal(url);
            } catch (error: unknown) {
                if (process.env.NODE_ENV == 'development')
                    console.log(`Failed to open url: ${error}`);
            }
        }
    };
    
    const maybeParseUrl = (value: string): URL | undefined => {
        
        if (typeof value === 'string') {
            try {
                return new URL(value);
            } catch (err) {
                // Errors are ignored, as we only want to check if the value is a valid url
                if (process.env.NODE_ENV == 'development')
                    console.log(`Failed to parse url: ${value}`);
            }
        }
    
        return undefined;
    };
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Receive and respond to synchronous message
// Set or remove notification badge
ipcMain.on('badge', (event, args) => {
    if (process.platform === 'darwin') {
        if (args != 0) {
            if (app.dock.getBadge()) {
                const badgeCount = parseInt(app.dock.getBadge()) + args;
                badgeCount > 0 ?
                app.dock.setBadge((parseInt(app.dock.getBadge()) + args).toString()) :
                app.dock.setBadge('')
            }
            else {
                args > 0 ?
                app.dock.setBadge(args.toString()) :
                app.dock.setBadge('')
            }
        }
        else {
            app.dock.setBadge('');
        }
        event.returnValue = true;
    }
    else {
        event.returnValue = false;
    }
});