//import libraries
import {world} from 'mojang-minecraft';

//prefix
const commandPrefix = '-h';
const commandList = ["move", "add", "warp", "delete", "location", "change", "set", "go", "remove", "pos", "spawn", "setspawn"];
let reply = [];

//run saat ada chat
world.events.beforeChat.subscribe(msg => {
	//main command
	if (msg.message.substr(0, commandPrefix.length) == commandPrefix) {
		//init sequence
		let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //ambil(grap) command and arguments
		let command = args_.shift().toLowerCase(); //ambil command
		let args = args_.join('_').toLowerCase(); //ambil arguments

		let player = msg.sender.name ?? msg.sender.nameTag; //ambil nama pemain || get player name
		msg.cancel = true; //cancel chat

		//test apa ini command yg butuh argument || test need argumet or not
		if (commandList.includes(command) && args.length <= 0) {
			runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cneed a home name" } ] }`,world.getDimension("overworld")); //lempar eror
			return
		}

		//get player coordinate
		let playerX = Math.floor(msg.sender.location.x);
		let playerY = Math.floor(msg.sender.location.y);
		let playerZ = Math.floor(msg.sender.location.z);
		let playerDimension = currentDimension(player);
		let playerDimId = dimToId(playerDimension);
		
		let getHomeTag = runCmd(`tag "${player}" list`,world.getDimension("overworld")).statusMessage;
		let homeReg = new RegExp(`§4§kH_${args}D_(\\d+)X_(-\\d+|\\d+)Y_(-\\d+|\\d+)Z_(-\\d+|\\d+)§r`);
		let homeNamesReg = /(?<=§4§kH_).+?(?=D_(\d+)X_(-\d+|\d+)Y_(-\d+|\d+)Z_(-\d+|\d+)§r)/g;

		let homeFind = getHomeTag.match(homeReg);
		
    
		let homeTagX = 0;
		let homeTagY = 0;
		let homeTagZ = 0;
		let homeDimension = 0;
		let allHomeName = ['☢'];
		let homeName = "error~";
		let homeDimensionName = "overworld";
		
		if (homeFind != null) {
			homeTagX = homeFind[0].match(/(?<=X_)(-\d+|\d+)/g);
			homeTagY = homeFind[0].match(/(?<=Y_)(-\d+|\d+)/g);
			homeTagZ = homeFind[0].match(/(?<=Z_)(-\d+|\d+)/g);
			homeDimension = homeFind[0].match(/(?<=D_)(-\d+|\d+)/g);
			allHomeName = getHomeTag.match(homeNamesReg);
			homeName = homeFind[0].match(homeNamesReg);
			homeDimensionName = idToDim(homeDimension[0]);
		}
		
		/*
		//debug
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home x = ${homeTagX[0]}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home y = ${homeTagY[0]}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home z = ${homeTagZ[0]}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home dimension = ${homeDimension[0]}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home dimension name = ${homeDimensionName}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1all home name = ${allHomeName}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1home name = ${homeName}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1player dimension = ${playerDimension}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1player dimension = ${playerDimension}" } ] }`, world.getDimension("overworld"));
		runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§1player dimension id = ${playerDimId}" } ] }`, world.getDimension("overworld"));
    */

		//blok main command
		switch (command) {
			case 'help':
				const helpMsg = `§1>--------------------------<\n§3${commandPrefix} <change;set;go;remove;pos;setspawn> <home name>\n§3${commandPrefix} <move;add;warp;delete;location;spawn> <home name>\n§3channge/move §9= to change your home point\n§3set/add §9= to set your home point\n§3go/warp §9= teleport to your home point\n§3remove/delete §9= remove your home point\n§3pos/location §9= show your home point coordinate\n§3setspawn/spawn §9= change your spawn point to your home point\n§1>--------------------------<\n§3${commandPrefix} <list;clear>\n§3list §9= show all home you have\n§3clear §9= remove all home you have\n§1>--------------------------<\n§9space in <home name> will be replace by '_'\n§1>--------------------------<`;
				runCmd(`tellraw "${player}" { "rawtext": [ { "text": "${helpMsg}" } ] }`,world.getDimension("overworld"));
				break;
			case 'clearchat':
			  for (let i = 0; i < 20; i++) {
			    runCmd(`tellraw "${player}" { "rawtext": [ { "text": " " } ] }`,world.getDimension("overworld"));
			  }
			  break
			case 'add':
			case 'set':
				if (allHomeName.includes(args)) {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou have home §5${args}§c, use §3-h change <homeName> §cto change home location" } ] }`,world.getDimension("overworld"));
				} else {
					runCmd(`tag "${player}" add "§4§kH_${args}D_${playerDimId}X_${playerX}Y_${playerY}Z_${playerZ}§r"`,world.getDimension(playerDimension));
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ayou set a home name §5${args} §aat §aX:§5${playerX}§a, Y:§5${playerY}§a, Z:§5${playerZ}\n§ause §3-h change ${args} §ato change home location" } ] }`,world.getDimension("overworld"));
				}
				break;
			case 'move':
			case 'change':
				if (allHomeName.includes(args)) {
					runCmd(`tag "${player}" remove "§4§kH_${args}D_${homeDimension[0]}X_${homeTagX[0]}Y_${homeTagY[0]}Z_${homeTagZ[0]}§r"`, world.getDimension(playerDimension));
					runCmd(`tag "${player}" add "§4§kH_${args}D_${playerDimId}X_${playerX}Y_${playerY}Z_${playerZ}§r"`, world.getDimension(playerDimension));
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ayou have change your home §5${args} §alocation at §aX:§5${playerX}§a, Y:§5${playerY}§a, Z:§5${playerZ}" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou don\'t have home §5${args}§c, use §3-h set <homeName> §cto make one" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'warp':
			case 'go':
				if (allHomeName.includes(args)) {
					runCmd(`tp "${player}" ${homeTagX[0]} ${homeTagY[0]} ${homeTagZ[0]}`, world.getDimension(homeDimensionName));
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ayou got teleported to home §5${args}" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou don\'t have home §5${args}§c, use §3-h set <homeName> §cto make one" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'delete':
			case 'remove':
				if (allHomeName.includes(args)) {
					runCmd(`tag "${player}" remove "§4§kH_${args}D_${homeDimension[0]}X_${homeTagX[0]}Y_${homeTagY[0]}Z_${homeTagZ[0]}§r"`, world.getDimension(playerDimension));
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ayou remove home §5${args}" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou don\'t have home §5${args}§c, use §3-h set <homeName> §cto make one" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'owned':
			case 'list':
        let allHome = getHomeTag.match(homeNamesReg);
				if (allHome == null) {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cno home found" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§aall your home : §5${allHome.sort().join(', ')}" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'spawn':
			case 'setspawn':
				if (allHomeName.includes(args)) {
					runCmd(`spawnpoint "${player}" ${homeTagX[0]} ${homeTagY[0]} ${homeTagZ[0]}`, world.getDimension(idToDim(homeDimension[0])));
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ayou set your spawn at home §5${args} §alocation §a\(x:§5${homeTagX[0]}§a,y:§5${homeTagY[0]}§a,z:§5${homeTagZ[0]}§a\)\n§1note:spawn point can change by clicking on bed" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou don\'t have home §5${args}§c, use §3-h set <homeName> §cto make one" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'pos':
			case 'location':
				if (allHomeName.includes(args)) {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ahome §5${args} §aat X:§5${homeTagX[0]}§a Y:§5${homeTagY[0]}§a Z:§5${homeTagZ[0]}§a Dimension:§5${idToDim(homeDimension[0])}" } ] }`, world.getDimension("overworld"));
				} else {
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cyou don\'t have home §5${args}§c, use §3-h set <homeName> §cto make one" } ] }`, world.getDimension("overworld"));
				}
				break;
			case 'clear':
			  let home = getHomeTag.match(homeNamesReg);
		    if(home == null){
					runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cno home found" } ] }`, world.getDimension("overworld"));
		    }else{
		      reply.push(player);
				  runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§aare you sure, you want to clear all your home?\n§atype §5-h yes§a to confirm and §5-h no§a to cancel" } ] }`, world.getDimension("overworld"));
		    }
		    break;
		  case 'yes':
		    if(reply.includes(player)){
		      let home = getHomeTag.match(homeNamesReg);
		      if(home == null){
		        let a = reply.indexOf(player);
  		      reply.splice(a,1);
				    runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cno home found, §5cancel the operation" } ] }`, world.getDimension("overworld"));
		      }else{
  		      for (let i = 0; i < home.length; i++) {
  		        let regH = new RegExp(`§4§kH_${home[i]}D_(\\d+)X_(-\\d+|\\d+)Y_(-\\d+|\\d+)Z_(-\\d+|\\d+)§r`);
  		        let honame = getHomeTag.match(regH);
  		        runCmd(`tag "${player}" remove "${honame[0]}"`, world.getDimension(playerDimension));
  		      }
  		      let a = reply.indexOf(player);
  		      reply.splice(a,1);
  				  runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§aall home removed" } ] }`, world.getDimension("overworld"));
		      }
		    }else{
				  runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ccan't use this command" } ] }`, world.getDimension("overworld"));
		    }
		    break;
		  case 'no':
		    if(reply.includes(player)){
		      let a = reply.indexOf(player);
		      reply.splice(a,1);
				  runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§acancel the operation" } ] }`, world.getDimension("overworld"));
		    }else{
				  runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§ccan't use this command" } ] }`, world.getDimension("overworld"));
		    }
		    break;
			default:
				runCmd(`tellraw "${player}" { "rawtext": [ { "text": "§cunknown command, do §3${commandPrefix} help" } ] }`, world.getDimension("overworld"));
				break;
		}
	}
})

//get player dimension
function currentDimension(player) {
	let over = true;
	let nether = true;
	try {
		runCmd(`execute "${player}" ~ ~ ~ testforblock ~ -64 ~ bedrock`,world.getDimension("overworld"));
	} catch (e) {
		over = false;
	}
	try {
		runCmd(`execute "${player}" ~ ~ ~ testforblock ~ 127 ~ bedrock`,world.getDimension("nether"));
	} catch (e) {
		nether = false;
	}
	if (over) {
		return "overworld"
	} else if (nether) {
		return "nether"
	} else {
		return "the end"
	}
}
//convert dimension to id
function dimToId(dimension) {
	if (dimension == "overworld") {
		return "0"
	}
	if (dimension == "nether") {
		return "1"
	}
	if (dimension == "the end") {
		return "2"
	}
}
//convert id to dimension
function idToDim(dimension) {
	if (dimension == 0 || dimension == "0") {
		return "overworld"
	}
	if (dimension == 1 || dimension == "1") {
		return "nether"
	}
	if (dimension == 2 || dimension == "2") {
		return "the end"
	}
}
//run command
function runCmd(cmd, dim) {
	return dim.runCommand(cmd);
}
// just for debug
function say(msg) {
	runCmd(`say ${msg}`,world.getDimension("overworld"));
}

function tryCmd(cmd,dim) {
    try {
        return{
            result:runCmd(cmd,dim),
            error:false
        }
    } catch (e) {
        return{
            result:JSON.parse(e),
            error:true
        }
    }
}
