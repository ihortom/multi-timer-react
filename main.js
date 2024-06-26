const { BrowserWindow, app, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    let width;
    if (process.env.ENV == 'DEV') {
        width = 1200;
    }
    else {
        width = 496;
    }

    const win = new BrowserWindow({
        titleBarStyle: "hidden",
        width: width,
        height: 659,
        backgroundColor: "white",
        resizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html');

    // Open the DevTools
    if (process.env.ENV == 'DEV') {
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', () => {win.show()});
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Receive and respond to synchronous message
// Set or remove notification badge
ipcMain.on('badge', (event, args) => {
    if (process.platform === 'darwin') {
        if (args != 0) {
            if (app.dock.getBadge()) {
                let badgeCount = parseInt(app.dock.getBadge()) + args;
                if (badgeCount > 0) {
                    app.dock.setBadge((parseInt(app.dock.getBadge()) + args).toString());
                }
                else {
                    app.dock.setBadge('');
                }
            }
            else {
                if (args > 0) {
                    app.dock.setBadge(args.toString());
                }
                else {
                    app.dock.setBadge('');
                }
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
