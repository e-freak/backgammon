/**
 * poke-freak.js
 * 
 * @author yuki
 */

'use strict';

const electron = require('electron');



const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600, resizable: true });
    mainWindow.loadURL('file://' + __dirname + '/app/view/title.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

