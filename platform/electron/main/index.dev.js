const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const beginServer = require('../backend');
const {
  isDev,
  getRecentLoginInfo,
  saveLoginInfo,
  getScreenSize,
} = require('./util');
const configureMenu = require('./menu');
const { APP_NAME } = require('./constant');

app.name = APP_NAME;

// eslint-disable-next-line no-console
const log = console.log;

let win = undefined;
let listener = undefined;

async function createWindow() {
  try {
    // Load conf file for retrieving the recent XNAT URL
    const { xnatUrl, username } = getRecentLoginInfo();
    listener = await beginServer();
    const port = listener.address().port;
    log(`Internal Server running on port ${port} 🔥`);

    const { width, height } = getScreenSize();
    win = new BrowserWindow({
      width: parseInt(width * 1),
      height: parseInt(height * 1),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
      },
    });
    configureMenu(Menu, win);

    win.loadURL(
      `http://localhost:${port}?xnatUrl=${xnatUrl}&username=${username}`
    );

    win.webContents.once('dom-ready', () => {
      win.webContents.send('clear-user');
    });

    if (isDev()) {
      win.webContents.openDevTools();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    log(error);
  }
}

app.whenReady().then(async () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (listener) {
    listener.close();
    listener = undefined;
    win = undefined;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('save-login-info', (event, loginInfo) => {
  console.log('save-xnat-url!!!!!!!!!!!!!!');
  saveLoginInfo(loginInfo);
});
