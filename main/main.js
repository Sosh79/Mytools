const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
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
        icon: path.join(__dirname, '../assets/icon.png')
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
