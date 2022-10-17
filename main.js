// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT

const { app, BrowserWindow, Menu } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
        }
    });
    const Store = require('electron-store');
    const settings = new Store();
    var template;
    if(settings.get("virgin", true)) {
        win.loadFile('Setup/setup0.html');
    }
    else {
        win.loadFile('src/index.html');
    }
    if (settings.get("devMode", false) === false) {
        win.kiosk = true
        template = [
            {
                label: 'Loading...',
            }
        ];
    }
    else {
        win.openDevTools();
        template = [
            {
                label: '[DEV MODE]',
                submenu: [
                    {
                        label: 'Toggle Dev Tools',
                        accelerator: 'F12',
                        click: function (item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.toggleDevTools();
                            }
                        }
                    },
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: function (item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.reload();
                            }
                        }
                    },
                    {
                        label: 'Force Reload',
                        accelerator: 'CmdOrCtrl+Shift+R',
                        role: "forceReload"
                    }
                ]
            },
        ];
    }
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
app.whenReady().then(() => {
    createWindow();
});
