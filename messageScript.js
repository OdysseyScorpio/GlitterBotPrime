var scripts = require('./scripts.js')
var adminScripts = require('./adminScripts.js')
var GBP = "GlitterBot Prime"
var command = process.env.CMD;;
module.exports = {
    message: function (bot, user, userID, channelID, messageReceived, msg, logger) {
        var botName = (bot.user.username == GBP ? "gbp" : "UNKNOWN")

        var done = false
        if (messageReceived.
            substring(0, 1) == command) {
            if (scripts.checkChannel(botName, channelID, "admin")) {
                console.log("admin command")
                done = adminScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
            }
        }

    },
    getCommand: function () {
        return command
    }
}