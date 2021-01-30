var fs = require('fs');
var scripts = require('./scripts.js')
var forgotSomething = "```You forgot something, you need to include something with that command, check !help for further info.```"
const dir = process.env.DIR;
var listentomessages = require(dir + '/listentomessages.json')
module.exports = {
    commands: function (command, bot, user, userID, channelID, messageReceived, msg) {
        var done = true
        var messages = messageReceived.toString().split("\n");
        var attachments = ""
        msg.attachments.forEach(attachment => {
            attachments = attachment.url;
        });
        messages.forEach(function (message) {
            args = message.substring(1).split(' ');
            cmd = args[0]
            replyMessage = "";
            suggestionText = "";
            args = args.splice(1);
            var gbp = "GlitterBot Prime"
            var botName = "gbp"
            const channel = bot.channels.cache.get(channelID);
            switch (cmd.toLowerCase()) {
                case "listentomessage":
                    var query = message.replace(command + cmd, "").trim()

                    if (!query) {
                        msg.reply('Please enter the ID of the message you wish me to start listening to, timeout 2 minutes');
                    }
                    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                        { max: 1, time: 120000 }).then(collected => {
                            // only accept messages by the user who sent the command
                            // accept only 1 message, and return the promise after 10000ms = 10s

                            // first (and, in this case, only) message of the collection
                            messageArray = collected.first().content.split("\n")
                            if (messageArray.length == 1) {
                                var query = messageArray[0].toString().trim()
                                msg.reply('Thank you, I am now listening to message with ID:' + query + '\n Please send a list of roles and the emojii you want to assign to each, e.g. @role :blue_heart:');
                                msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                                    { max: 1, time: 120000 }).then(collected => {
                                        messageArray = collected.first().content.split("\n")
                                        console.log(messageArray)
                                        var responseArray = []
                                        for (var r = 0; r <= messageArray.length - 1; r++) {
                                            console.log("here:" + r + messageArray[r])
                                            splitObj = messageArray[r].toString().trim().split(" ")
                                            console.log("splitObj" + splitObj)
                                            console.log(splitObj[0])
                                            console.log(splitObj[1])
                                            var responseObject = {
                                                "role": splitObj[0].toString().trim(),
                                                "reaction": splitObj[1].toString().trim()
                                            }
                                            responseArray.push(responseObject)

                                        }
                                        console.log("end loop")
                                        console.log(query)
                                        console.log(responseArray)
                                        var saveMessage = {
                                            "messageID": query,
                                            "roles": responseArray
                                        }
                                        console.log(saveMessage)
                                        console.log(listentomessages)
                                        listentomessages.push(saveMessage)
                                        file = dir + '/listentomessages.json'
                                        fs.writeFile(file, JSON.stringify(listentomessages), 'utf8', function (err) {
                                            if (err) throw err;
                                        });
                                        msg.reply('Thank you, JSON:' + JSON.stringify(listentomessages));

                                    }).catch(() => {
                                        msg.reply('I stopped listening or something went wrong, please try again');
                                    });
                            }
                            else
                                msg.reply('I stopped listening or something went wrong, please try again');
                        }).catch(() => {
                            msg.reply('I stopped listening or something went wrong, please try again');
                        });

                    // msg.reply('Please now message me with the list');


                    break;
                default:
                    done = false
            }
        })
        return done
    }
}