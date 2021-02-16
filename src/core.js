const fs = require("fs");
const os = require("os");
const ps = require("current-processes");
const RPC = require("discord-rpc");
const rpc = new RPC.Client({
    transport: "ipc"
});

const put = `C:/Users/${os.userInfo().username}/AppData/Roaming/.vimeworld/config`;

let run;
let type;
let server;
let started;
let username;

module.exports = {
    create_rpc: async function  (username, server){
        rpc.on("ready", () => {
            rpc.setActivity({
                state: username,
                details: server,
                startTimestamp: Date.now(),
                largeImageKey: `default`,
                largeImageText: `VimeWorld.ru`
            });
        });
        rpc.login({
            clientId: "765938499483598929"
        });
    },
    destroy_rpc: async function(){
        rpc.destroy;
    },
    search: async function (param, app){
        ps.get(async function(err, processes) {
            const sorted = await processes;

            sorted.forEach(async function(item) {
                if(item["name"] == "VimeWorld"){
                    console.log(item)
                    console.log("\n[Debug] VimeWorld is running")
                    started = "true";
                    if(item["cpu"] < 30){
                        console.log("[Debug] CPU < 30, restarting")
                        setTimeout(function() {
                            module.exports.search(null, app)
                            return
                        }, 18000);
                    }
                    else{
                        console.log("[Debug] Detecting..")
                        const fileContent = fs.readFileSync(put, "utf8").split("\n");
                        
                        for (let i = 0; i != fileContent.length; i++) {
                            type = fileContent[i].split(":");
                            switch(type[0]){
                                case 'username':
                                    username = type[1];
                                    console.log(`[DETECT] Username is ${username}`);
                                break;
                                case 'server':
                                    server = type[1];
                                    console.log(`[DETECT] Server is ${server}`);
                                break; 
                            }
                        }

                        if(username && server && server !== "CivCraft" && server !== "MiniGames"){
                            if(param == null){
                                console.log("[Debug] Create RPC")
                                module.exports.create_rpc(username, server);
                            }
                        }

                        setTimeout(async function() {
                            console.log("[Debug] Checking..")
                            ps.get(async function(err, processes) {
                                var proc = await processes;

                                run = 'false';

                                proc.forEach(async function(item, index, array) {
                                    if(item["name"] == `${server} VimeWorld.ru` || item["name"] == `VimeWorld` || item["name"] == `VimeWorld.ru`){
                                        run = "true"
                                    }    
                                }); 

                                if(run == "true"){
                                    console.log("[Debug] VimeWorld is running")
                                    module.exports.search("+", app);
                                }  
                                else{
                                    console.log("[Debug] VimeWorld is closed")
                                    app.relaunch()
                                    app.exit()
                                }
                            });
                        }, 30000);
                    }
                }
            });
            if(started !== "true"){
                console.log("[Debug] VimeWorld is not running")
                setTimeout(async function() {
                    module.exports.search(null, app);
                    return
                }, 18000);
            }
        });
    }
}