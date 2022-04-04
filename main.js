const { app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
const url = require('url');
// require('electron-reload')(__dirname)
require('./data/database');

let win ;

function createWindow () {
    win = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1024,
    minHeight: 600,
    webPreferences:{
      nodeIntegration : true,
      preload:__dirname + '/preload.js',
      webSecurity: true,
      contextIsolation: true,
      enableRemoteModule: false,

    }
  })

  win.loadFile('pages/index.html')
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
  
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})





ipcMain.on('pasar-id-pagina-mes',(e, id) => {
  win.loadFile('pages/empresa.html')
  win.webContents.send('enviar-id',id)
  console.log("envie el id: "+id)
 
})