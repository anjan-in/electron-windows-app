const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
});
contextBridge.exposeInMainWorld('electronAPI', {
    saveNote: (note) => ipcRenderer.send('save-note', note),
    loadNote: () => ipcRenderer.invoke('load-note')
});
contextBridge.exposeInMainWorld('taskAPI', {
    addTask: (task) => ipcRenderer.send('add-task', task),
    loadTasks: () => ipcRenderer.invoke('load-tasks'),
    deleteTask: (index) => ipcRenderer.send('delete-task', index)
});
contextBridge.exposeInMainWorld('fileAPI', {
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    openFile: (filePath) => ipcRenderer.send('open-file', filePath)
});
contextBridge.exposeInMainWorld('imageAPI', {
    selectImage: () => ipcRenderer.invoke('select-image')
});
contextBridge.exposeInMainWorld('systemAPI', {
    getSystemInfo: () => ipcRenderer.invoke('get-system-info')
});
// contextBridge.exposeInMainWorld('clipboardAPI', {
//     getClipboardText: () => ipcRenderer.invoke('get-clipboard-text'),
//     copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text)
// });
contextBridge.exposeInMainWorld('clipboardAPI', {
    getClipboardText: async () => await ipcRenderer.invoke('get-clipboard-text'),
    copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text)
});
