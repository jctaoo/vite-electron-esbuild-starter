import { app, BrowserWindow } from "electron";
import { add } from "@common/utils";

const isDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  console.log('test23ss');
  if (isDevelopment) {
    win.loadURL("http://localhost:3000")
  } else {
    win.loadFile("./index.html");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
