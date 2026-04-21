import { ipcRenderer, contextBridge } from 'electron';


declare global {
    interface Window {
        electron: {
            updateBadge: (data: number | string) => void;
            openExternal: (url: string) => void;
            versions: {
                node: string;
                electron: string;
                chrome: string;
            };
            arch: string;
        };
    }
}


contextBridge.exposeInMainWorld('electron', {
    // Update the badge count in Mac OS
    updateBadge: (data: number | string) => {
        ipcRenderer.send('badge', data);
    },
    // Open a URL in the user's default browser
    openExternal: (url: string) => {
        ipcRenderer.send('open-external', url);
    },
    versions: {
        node: process.versions.node,
        electron: process.versions.electron,
        chrome: process.versions.chrome,
    },
    arch: process.arch,
});
