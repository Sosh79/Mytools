const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMenu } = require('./menu');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '../assets/icon.ico')
    });

    // Load home page
    loadPage('home');

    // Create menu
    createMenu(mainWindow, loadPage);

    // Open dev tools in development mode
    // mainWindow.webContents.openDevTools();
}

// Function to load pages
function loadPage(pageName) {
    const pagePath = path.join(__dirname, '../pages', pageName, 'index.html');
    mainWindow.loadFile(pagePath);
}

// Receive navigation requests from pages
ipcMain.on('navigate-to-page', (event, pageName) => {
    loadPage(pageName);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle open chat log request
ipcMain.handle('open-chat-log', async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            title: 'Open DiscordChat log',
            properties: ['openFile'],
            filters: [
                { name: 'Log Files', extensions: ['log', 'txt'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (canceled || !filePaths || filePaths.length === 0) {
            return { canceled: true };
        }
        const filePath = filePaths[0];
        const content = await fs.promises.readFile(filePath, 'utf8');
        return { canceled: false, content, filePath };
    } catch (err) {
        return { canceled: true, error: String(err) };
    }
});

// Handle save file request
ipcMain.handle('save-file', async (event, content, defaultName) => {
    try {
        const extension = defaultName.endsWith('.json') ? 'json' : (defaultName.endsWith('.xml') ? 'xml' : 'txt');
        const filterName = extension === 'json' ? 'JSON Files' : (extension === 'xml' ? 'XML Files' : 'Text Files');

        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
            title: 'Save File',
            defaultPath: defaultName || 'output.txt',
            filters: [
                { name: filterName, extensions: [extension] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (canceled || !filePath) {
            return { canceled: true };
        }
        await fs.promises.writeFile(filePath, content, 'utf8');
        return { canceled: false, filePath };
    } catch (err) {
        return { canceled: true, error: String(err) };
    }
});
