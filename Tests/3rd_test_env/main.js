const {app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = (screen) => {

    const display = screen.getPrimaryDisplay()
    const {width, height} = display.workAreaSize

    const win = new BrowserWindow({
      width: width,
      height: height,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')
}

app.whenReady().then(() => {

    const {screen} = require('electron')

    createWindow(screen)

    app.on('activate', () => {
        
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') app.quit()
})