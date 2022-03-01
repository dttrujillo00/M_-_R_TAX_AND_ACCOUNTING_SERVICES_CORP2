const { app, BrowserWindow } = require('electron');
// require('electron-reload')(__dirname)
require('./data/database');



function createWindow () {
  const win = new BrowserWindow({
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

