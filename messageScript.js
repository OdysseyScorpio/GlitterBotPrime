var fs = require('fs');
var scripts = require('./scripts.js')
var adminScripts = require('./adminScripts.js')
const dir = process.env.DIR;
var channels = require( dir + "/channels.json");
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
        //     if (!done && scripts.checkChannel(botName, channelID, "helper")) {
        //         console.log("Helper command")
        //         done = helperScripts.commands(command, bot, user, userID, channelID, messageReceived,msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "awards")) {
        //         console.log("Awards command")
        //         done = awardScripts.commands(command, bot, user, userID, channelID, messageReceived , msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "admin")) {
        //         console.log("Admin command")
        //         done = adminScripts.commands(command, bot, user, userID, channelID, messageReceived , msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "superAdmin")) {
        //         console.log("Super Admin command")
        //         done = superAdminScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "blackList")) {
        //         console.log("Black List command")
        //         done = blackListScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "public")) {
        //         console.log("Public command")
        //         done = publicScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "daily")) {
        //         console.log("Daily command")
        //         done = dailyScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
        //     }
        //     if (!done && scripts.checkChannel(botName, channelID, "dailyAdmin")) {
        //         console.log("Daily Admin command")
        //         done = dailyAdminScripts.commands(command, bot, user, userID, channelID, messageReceived, msg)
        //     }
        }

    },
    getCommand: function () {
        return command
    }
}