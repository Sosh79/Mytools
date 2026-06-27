const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to pages
contextBridge.exposeInMainWorld('electronAPI', {
    navigateToPage: (pageName) => ipcRenderer.send('navigate-to-page', pageName),
    openChatLog: () => ipcRenderer.invoke('open-chat-log'),
    saveFile: (content, defaultName) => ipcRenderer.invoke('save-file', content, defaultName),
    getUsername: () => ipcRenderer.invoke('get-username'),
    loginAttempt: (username, password) => ipcRenderer.invoke('login-attempt', username, password),
    registerAttempt: (username, password) => ipcRenderer.invoke('register-attempt', username, password),
    updateProfile: (currentUsername, newUsername, oldPassword, newPassword) => ipcRenderer.invoke('update-profile', currentUsername, newUsername, oldPassword, newPassword)
});
