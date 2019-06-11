// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, session} = require('electron')
const ip = "172.17.65.177";
const port = "3303";
const serverIP = `http://${ip}:${port}`;
var currentRoom;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    title: "openChat",
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./renderer/login.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('quit app', (event) => {
    mainWindow = null;
    app.quit();
})

ipcMain.on('get serverIP', (event) => {
    event.returnValue = serverIP;
})

ipcMain.on('get userName', (event) => {
    session.defaultSession.cookies.get({url: serverIP})
    .then((cookies) => {
        event.returnValue = cookies[0].value;
    }).catch((error) => {
        console.log(error);
    })
})

ipcMain.on('render', (event, target) => {
    mainWindow.loadFile('./renderer/'+target);
})

ipcMain.on('set cookie', (event, user_name) => {

    const cookie = { url: serverIP, name: 'userName', value: user_name }

    session.defaultSession.cookies.set(cookie)
    .then(() => {
        event.reply('set cookie success');
    }, (error) => {
        console.log(error);
        event.reply('set cookie fail');
    })
})

ipcMain.on("set currentRoom", (event, room_name) => {
    currentRoom = room_name;
    event.returnValue = currentRoom;
})

ipcMain.on("get currentRoom", (event) => {
    event.returnValue = currentRoom;
})