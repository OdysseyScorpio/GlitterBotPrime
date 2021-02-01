let fs = require('fs');
let jmespath = require('jmespath');
const dir = process.env.DIR;
let channels = require(dir + "/channels.json");

module.exports = {
    sendAnnouncement: function (channel, input) {
        var replyMessage = ""
        console.log(input)
        replyMessage = input.toString()
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
    checkChannel: function (botName, channelID, permission) {
        var searchString = '@."' + channelID + '"' + '.permissions."' + botName + '"'
        var result = jmespath.search(channels, searchString);
        if (result != null && result != "" && result.includes(permission)) {
            return true;
        } else {
            return false;
        }

    }

}