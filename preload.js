// window.ipcRenderer=require('electron').ipcRenderer 
// console.log("estoy en el preload")

const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the IPC renderer 
// to the main window. They'll be accessible at "window.ipcRenderer".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
});





// const invoke = (async(event,param)=> 
// {
//     await ipcRenderer.invoke(event,param).then((result) => {
//         console.log("Termino la consulta");
//         console.log(result);
//         return result;
//     });
// });




