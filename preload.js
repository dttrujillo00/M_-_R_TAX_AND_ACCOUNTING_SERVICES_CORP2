// window.ipcRenderer=require('electron').ipcRenderer 
// console.log("estoy en el preload")

const { contextBridge, ipcRenderer } = require("electron");


process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
});





