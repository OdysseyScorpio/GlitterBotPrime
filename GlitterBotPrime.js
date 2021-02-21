const Discord = require('discord.js');
var logger = require('winston');
const dir = process.env.DIR;
var auth = require(dir + '/auth.json');
var scripts = require('./scripts.js')
var messageScript = require('./messageScript.js')
var runningState = ""
var jmespath = require('jmespath');
var guild

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
process.setMaxListeners(0);
bot.login(auth.token);
bot.on('ready', () => {
    var user = bot.users.cache.get('353894762761289728');
    console.log(`Logged in as ${bot.user.tag}!`);
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
    if (messageScript.getCommand() == "$") {
        runningState = bot.user.username + " running in debug"
    } else {
        runningState = bot.user.username + " has been restarted"
    }
    try {
        scripts.sendAnnouncement(user, runningState)
    } catch (error) {
        console.log("Error sending message to user:" + user, error);
    }

    bot.user.setPresence(
        {
            activity:
                { name: 'restocking shelves' }, status: 'online'
        });

    guild = bot.guilds.cache.get('691393114186711120')

});
bot.on('message', msg => {
    var username = msg.author.username
    var userID = msg.author.id
    var channelID = (msg.channel.id ? msg.channel.id : Message.channel.TextChannel.id)
    var messageReceived = msg.content
    messageScript.message(bot, username, userID, channelID, messageReceived, msg, logger);
});
bot.on('messageReactionAdd', async (reaction, user) => {
    var blockedUsers = require(dir + '/blockedUsers.json')
    var userIsBlocked = blockedUsers.includes(user.id);

    if (userIsBlocked) {
        console.log("User is blocked, permission denied")
    } else {

        console.log(reaction._emoji.name)
        // When we receive a reaction we check if the reaction is partial or not
        if (reaction.partial) {
            // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        console.log(reaction.message.id)
        var listentomessages = require(dir + '/listentomessages.json')
        var searchString = '[? messageID == `"' + reaction.message.id + '"`].roles'
        results = jmespath.search(listentomessages, searchString)
        if (results != [] && results.length == 1) {
            roles = results[0]
            for (var r = 0; r <= roles.length - 1; r++) {
                console.log(roles[r].reaction)
                if (roles[r].reaction == reaction._emoji.name) {
                    giveRole = roles[r].role.toString().replace(/[^0-9]/g, "")
                    const role = guild.roles.cache.get(giveRole);
                    member = guild.members.cache.get(user.id)
                    member.roles.add(role);
                }
            }

        }
    }
});