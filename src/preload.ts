import { ipcRenderer, contextBridge } from 'electron';


//Expose protected methods that allow renderer using them
declare global {
    interface Window {
        electron: any;
    }
}


// Expose the ipcRenderer
contextBridge.exposeInMainWorld('electron', {
    // Update the badge count in Mac OS
    updateBadge: (data: number) => {
        ipcRenderer.send('badge', data);
    }
})
