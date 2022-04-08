// window.ipcRenderer=require('electron').ipcRenderer 
const { contextBridge, ipcRenderer } = require("electron");


process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer",{ invoke: ipcRenderer.invoke, on:ipcRenderer.on, send: ipcRenderer.send});
  
});


