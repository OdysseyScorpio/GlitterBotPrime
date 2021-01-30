let fs = require('fs');
let jmespath = require('jmespath');
let request = require('sync-request');
const dir = process.env.DIR;
let channels = require(dir + "/channels.json");

module.exports = {
    sendAnnouncement: function (channel, input) {
        var quoteString = "```"
        var x = 0;
        var replyMessage = ""
        console.log(input)
        replyMessage = input.toString() //.replace(quoteString, "").replace(quoteString, "")
        if (replyMessage != "") {
            if (replyMessage.length > 2000) {
                console.log("sending long Message")
                sendMessage = ""
                var lines = replyMessage.split("\n")
                if (lines.length > 18) {
                    console.log("more than 18 lines")
                    for (var L = 0; L < lines.length - 1; L) {
                        for (var N = 0; N <= 17; N++) {
                            sendMessage += lines[L] + "\n"
                            L++
                            if (L > lines.length - 1 || lines[L].trim() == "") {
                                break
                            }
                        }
                        if (sendMessage != "") {
                            channel.send(sendMessage)
                            sendMessage = ""
                        }
                    }
                } else { }
                return
            } else {
                console.log("sending short Message")
                channel.send(replyMessage)
            }
        }
    },
    sendMessage: function (channel, input) {
        var quoteString = "```"
        var x = 0;
        var replyMessage = ""
        replyMessage = input.replace(quoteString, "").replace(quoteString, "")
        if (replyMessage != "") {
            if (replyMessage.length > 2000) {
                console.log("sending long Message")
                sendMessage = ""
                var lines = replyMessage.split("\n")
                if (lines.length > 18) {
                    console.log("more than 18 lines")
                    for (var L = 0; L < lines.length - 1; L) {
                        for (var N = 0; N <= 17; N++) {
                            sendMessage += lines[L] + "\n"
                            L++
                            if (L > lines.length - 1 || lines[L].trim() == "") {
                                break
                            }
                        }
                        if (sendMessage != "") {
                            channel.send(quoteString + sendMessage + quoteString)
                            sendMessage = ""
                        }
                    }
                } else { }
                return
            } else {
                console.log("sending short Message")
                channel.send(quoteString + replyMessage + quoteString)
            }
        }
    },
    sendMessageFile: function (channel, image, message = "") {
        try {
            channel.send(message, {
                files: [{
                    attachment: image,
                    name: 'daily.png'

                }]
            });
        } catch (error) {
            channel.send("Something went wrong, try again.");
        }

    },
    wait: function () {
        var start = new Date().getTime();
        var end = start;
        while (end < start + 1000) {
            end = new Date().getTime();
        }
    },
    checkChannel: function (botName, channelID, permission) {
        //console.log(botName + channelID + permission);
        var searchString = '@."' + channelID + '"' + '.permissions."' + botName + '"'
        var result = jmespath.search(channels, searchString);
        if (result != null && result != "" && result.includes(permission)) {
            return true;
        } else {
            return false;
        }

    },
    savePID: function (bot) {
        var CC = "Collective Consciousness"
        var AG = "Admiral Goatus Maximus"
        var PADD = "PADD"
        var botName = (bot == CC ? "CC" : (bot == AG ? "AG" : "PADD"))
        fs.writeFile('./TXT/' + botName + '.pid', parseInt(process.pid, 10).toString(), 'utf8', function (err) {
            if (err) throw err;
        });
    },
    checkBot: function (bot, isSilent, channel) {
        var CC = "Collective Consciousness"
        var AG = "Admiral Goatus Maximus"
        var botName = (bot == "CC" ? CC : AG)
        var botPID = fs.readFileSync('./TXT/' + bot + '.pid', 'utf8');
        var PADDPID = fs.readFileSync('./TXT/PADD.pid', 'utf8');
        console.log(botPID)
        isBotAlive = require('is-running')(botPID)
        isPADDAlive = require('is-running')(PADDPID)
        console.log(isBotAlive)
        if (!isBotAlive) {
            const spawn = require('child_process').spawn;
            var scriptArgs = [bot + '.sh'];
            var child = spawn('sh', scriptArgs, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
            console.log(bot + " is now alive")
            if (!isSilent) {
                this.sendMessage(channel, "I am waking " + botName + " up now.")
            }
        } else {
            if (!isSilent) {
                this.sendMessage(channel, botName + " is already awake.")
            }
            console.log(bot + " is alive")
        }

        if (!isPADDAlive) {
            const spawn = require('child_process').spawn;
            var scriptArgs = ['PADD.sh'];
            var child = spawn('sh', scriptArgs, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
        }
    },
    restartBot: function () {
        console.log("This is pid " + process.pid);
        setTimeout(function () {
            process.on("exit", function () {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit"
                });
            });
            process.exit();
        }, 1000);
    },
    killAllBots: function () {
        console.log("This is pid " + process.pid);
        setTimeout(function () {
            process.kill(process.pid);
            console.log("done")
        }, 1000);
    }

}