/**
 * Created by hong on 2016-06-20.
 */

'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow(
        {
            name: 'Adun',
            width: 1100,
            height: 600,
            toolbar: false
        }
    );
    mainWindow.webContents.openDevTools({detach: true});
    mainWindow.loadURL('file://' + __dirname + '/public/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});








