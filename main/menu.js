const { Menu } = require('electron');

function createMenu(mainWindow, loadPage) {
    const template = [
        {
            label: 'Home',
            click: () => loadPage('home')
        },
        {
            label: 'Categories',
            submenu: [
                {
                    label: 'Teleport Generator',
                    click: () => loadPage('category1')
                },
                {
                    label: 'Zone Spawn System',
                    click: () => loadPage('category2')
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) focusedWindow.reload();
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) focusedWindow.toggleDevTools();
                    }
                }
            ]
        },
        {
            label: 'Exit',
            click: () => {
                const { app } = require('electron');
                app.quit();
            }
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = { createMenu };
