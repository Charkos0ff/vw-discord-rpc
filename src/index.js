const opn = require('opn')
const path = require('path');
const core = require('./core.js')
const { app, Menu, Tray } = require('electron')

let tray = null

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, '/icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Перезапустить', type: 'normal', click: function(){
      console.log("\n[Debug] Restarting..")
      app.relaunch()
      app.exit()
      
    }},
    { label: 'Официальная тема', type: 'normal', click: function () {
      console.log("[Debug] Opening official theme..")
      opn('https://qeo.su/vw-discord-rpc')
    }},
    { label: 'Выйти', type: 'normal', click: function () {
      console.log("[Debug] Goodbye!")
      core.destroy_rpc()
      app.quit()
    }}
  ])

  tray.setToolTip('Программа, выводящая статус вашей игры в Discord')
  tray.setContextMenu(contextMenu)
  core.search(null, app)
})