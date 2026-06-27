const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const os = require('os');

// Polyfill crypto for MongoDB in Electron
const crypto = require('crypto');
if (!global.crypto) {
    global.crypto = crypto;
}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { createMenu } = require('./menu');

// Connect to MongoDB
const isProd = app.isPackaged;
const mongoURI = isProd 
    ? process.env.MONGO_URI_PROD
    : (process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/mytools');

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB successfully:', isProd ? 'Cloud Database (Production)' : 'Local Database (Development)');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

let mainWindow;

// Disable hardware acceleration to prevent GPU crashes on some systems
app.disableHardwareAcceleration();

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

    mainWindow.maximize();

    // Load login page initially
    loadPage('login');

    // Remove native menu for premium look
    mainWindow.setMenu(null);
    // createMenu(mainWindow, loadPage);

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

// Handle get username request
ipcMain.handle('get-username', () => {
    try {
        return os.userInfo().username;
    } catch (e) {
        return process.env.USERNAME || 'User';
    }
});

// Auth Handlers
ipcMain.handle('login-attempt', async (event, username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return { success: true, message: 'Login successful' };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, message: 'Database error: ' + err.message };
    }
});

ipcMain.handle('register-attempt', async (event, username, password) => {
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        
        await newUser.save();
        return { success: true, message: 'Registration successful' };
    } catch (err) {
        console.error('Registration error:', err);
        return { success: false, message: 'Database error: ' + err.message };
    }
});

ipcMain.handle('update-profile', async (event, currentUsername, newUsername, oldPassword, newPassword) => {
    try {
        const user = await User.findOne({ username: currentUsername });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return { success: false, message: 'Incorrect old password' };
        }

        if (newUsername && newUsername !== currentUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return { success: false, message: 'New username is already taken' };
            }
            user.username = newUsername;
        }

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
        console.error('Update profile error:', err);
        return { success: false, message: 'Database error: ' + err.message };
    }
});
