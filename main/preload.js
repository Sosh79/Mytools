const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to pages
contextBridge.exposeInMainWorld('electronAPI', {
    navigateToPage: (pageName) => ipcRenderer.send('navigate-to-page', pageName),
    openChatLog: () => ipcRenderer.invoke('open-chat-log')
});
