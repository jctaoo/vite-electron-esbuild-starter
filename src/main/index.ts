import { app, BrowserWindow } from 'electron';

const isDevelopment = process.env.NODE_ENV === 'development';

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  if (isDevelopment) {
    win.loadURL("http://localhost:1337")
  } else {
    win.loadFile("./index.html");
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})