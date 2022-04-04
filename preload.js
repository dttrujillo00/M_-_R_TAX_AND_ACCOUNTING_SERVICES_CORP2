// window.ipcRenderer=require('electron').ipcRenderer 
const { contextBridge, ipcRenderer } = require("electron");


process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer",{ ...ipcRenderer, on :ipcRenderer.on});
  
});


