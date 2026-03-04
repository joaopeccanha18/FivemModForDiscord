const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('botAPI', {
    startBot: () => ipcRenderer.send('bot:start'),
    stopBot: () => ipcRenderer.send('bot:stop'),
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close'),
    onLog: (callback) => ipcRenderer.on('bot:log', (_, data) => callback(data)),
    onStatus: (callback) => ipcRenderer.on('bot:status', (_, status) => callback(status)),
});
