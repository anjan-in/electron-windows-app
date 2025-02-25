const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { dialog, shell } = require('electron');

let mainWindow;

// function createWindow() {
//     const win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             preload: path.join(__dirname, 'preload.js'), // Preload script
//             contextIsolation: true,
//             nodeIntegration: false,
//         }
//     });

//     win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
// }
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// app.whenReady().then(() => {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: false, // Improves security
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js')
//         }
//     });

//     mainWindow.loadFile('src/renderer/index.html');
// });

// Handle Note Save
ipcMain.on('save-note', (event, noteContent) => {
    const filePath = path.join(app.getPath('userData'), 'notes.txt');
    fs.writeFileSync(filePath, noteContent);
});

// Handle Note Load
ipcMain.handle('load-note', () => {
    const filePath = path.join(app.getPath('userData'), 'notes.txt');
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return '';
});

ipcMain.on('add-task', (event, task) => {
    const filePath = path.join(app.getPath('userData'), 'tasks.json');
    let tasks = [];
    if (fs.existsSync(filePath)) {
        tasks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    tasks.push(task);
    fs.writeFileSync(filePath, JSON.stringify(tasks));
});

ipcMain.handle('load-tasks', () => {
    const filePath = path.join(app.getPath('userData'), 'tasks.json');
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return [];
});

ipcMain.on('delete-task', (event, taskIndex) => {
    const filePath = path.join(app.getPath('userData'), 'tasks.json');
    let tasks = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    tasks.splice(taskIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(tasks));
});

// Open File Dialog
ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile']
    });

    return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

// Open File in Default App
ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath);
});

ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif', 'bmp'] }]
    });

    return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

const os = require('os');

ipcMain.handle('get-system-info', () => {
    return {
        cpu: os.cpus()[0].model,
        totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        osType: os.type(),
        uptime: (os.uptime() / 60 / 60).toFixed(2) + " hours"
    };
});

const { clipboard } = require('electron');

let clipboardHistory = [];

ipcMain.handle('get-clipboard-text', () => {
    const text = clipboard.readText();
    if (text && !clipboardHistory.includes(text)) {
        clipboardHistory.unshift(text); // Add new item to the top
        if (clipboardHistory.length > 10) clipboardHistory.pop(); // Limit history to 10 items
    }
    return clipboardHistory;
});

ipcMain.on('copy-to-clipboard', (event, text) => {
    clipboard.writeText(text);
});
