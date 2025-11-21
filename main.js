const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Dezactivează hardware acceleration pentru compatibilitate
app.disableHardwareAcceleration();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      backgroundThrottling: false
    },
    resizable: false,
    autoHideMenuBar: true,
    title: 'Head Football',
    backgroundColor: '#87CEEB',
    show: false
  });

  mainWindow.loadFile('index.html');

  // Arată fereastra când e gata de afișat
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Uncomment pentru debugging
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
