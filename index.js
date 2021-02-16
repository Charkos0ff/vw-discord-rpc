//Create Tray
let tray = new nw.Tray({
    title: 'RPC Mods',
    tooltip: 'Программа, выводящая статус вашей игры в Discord',
    icon: 'assets/icon.png'
});

let menu = new nw.Menu();
let itemChecked = true;

//Init functions
const ps = require('current-processes');
const fs = require("fs");
const os = require('os')
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
});

async function discord(type, username, server) {
    switch(type){
        case 'set':
            rpc.on("ready", () => {
                rpc.setActivity({
                    state: username,
                    details: server,
                    startTimestamp: Date.now(),
                    largeImageKey: 'default'
                });
            });
            rpc.login({
                clientId: "765938499483598929"
            });
        break;
        case 'delete':
            rpc.destroy;
        break;        
    }
}
async function set(com) {
    ps.get(async function(err, processes) {
        var sorted = await processes;
        var started;
     
        sorted.forEach(async function(item, index, array) {
            if(item['name'] == 'VimeWorld'){
                started = 'true';
                if(item['cpu'] < 30){
                    setTimeout(function() {
                        set();
                        return
                    }, 180000);
                }
                else{
					let type;
                    let username;
                    let server;
                    let put = "C:/Users/" + os.userInfo().username + "/AppData/Roaming/.vimeworld/config"
                    let fileContent = fs.readFileSync(put, "utf8");
                    fileContent = fileContent.split("\n");
                    
                    for (let i = 0; i != fileContent.length; i++) {
                        type = fileContent[i].split(":");
                        if(type[0] == 'username'){
                            username = type[1];
                        }
                        if(type[0] == 'server'){
                            server = type[1];
                        }
                    }
                    if(username && server && server !== 'CivCraft' && server !== 'MiniGames'){
                        if(com == null){
                            discord('set', username, server)
                        }    
                    }
                    setTimeout(async function() {
                        var proc = await processes;
                        let yes;
                        sorted.forEach(async function(item, index, array) {
                            if(item['name'] == 'VimeWorld'){
                                yes = 'true'
                            }    
                        }); 
                        if(yes !== 'true'){
                            nw.Window.get().close();
                        }  
                        else{
                            set('+')
                        }  
                    }, 300000);
                }
            }
        });
        if(started !== 'true'){
            setTimeout(async function() {
                set();
                return
            }, 180000);
        }
    });
}
//Start
set()

//Add tray
let menuItems = [
  {
    type: 'normal',
    label: 'Перезапустить',
    click: function () {
      set();
    }
  },
  {
    type: 'separator'
  },
  {
    type: 'normal',
    label: 'Закрыть',
    click: function () {
      nw.Window.get().close();
    }
  }
];

menuItems.forEach(function(item) {
    menu.append(new nw.MenuItem(item));
});

tray.menu = menu;