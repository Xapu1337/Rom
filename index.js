const config = require("./config.json");
const GuildModel = require("./utils/GuildSchema");
const { Utils } = require("./utils/utils");
const { connect } = require("mongoose");
const { Discord, Client, MessageEmbed, Collection, ColorResolvable, GuildMember} = require("discord.js");
const client = new Client({ ws: { properties: { $browser: "Discord iOS" }}, disableMentions: "everyone"});
const fs = require("fs");
const colors = require("colors");
const fetch = require("node-fetch");
const nano  = require("nanoid");
const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
});
client.player = player;
const betterCatNames = new Map();
betterCatNames.set("botrelated-informations", "🤖 - Bot information");
betterCatNames.set("fun", "🎭 - Fun Commands");
betterCatNames.set("information", "📃 - Information");
betterCatNames.set("moderation", "🛡 - Moderation");
betterCatNames.set("music-commands", "🎵 - Music Commands");
betterCatNames.set("server-actions", "💻 - Server Actions");
client.betterCategoryNames = betterCatNames;


/*
Public vars. accesable via Client.
 */

client.utils = Utils;




let Vibrant = require('node-vibrant');

(async() => {
    client.botAuthor = await client.users.fetch("188988455554908160");
})();

client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.charList = {
    EMPTY: "\u200B"
}

client.extendedMemberSearch = async function (message, args, argsIndex){
    console.log(message.guild.members.cache.get(args[argsIndex]))
    console.log(args[argsIndex])
    console.log(argsIndex)
    return message.mentions.members.first() || message.guild.members.cache.get(args[argsIndex]);
}

client.getColorFromUserId = async function (user){
    if(user instanceof GuildMember)
        console.log("Member")
        let userHex = (await Vibrant.from((await client.users.fetch(user.id)).displayAvatarURL({format: "png"})).getPalette()).Vibrant.hex
        if(userHex === null || userHex === undefined){
            return "#f0f0f0";
        }
        return userHex
}

client.getGuildDB = async function (gID){
    let guildDB = await GuildModel.findOne( { id: gID } );

    if(guildDB){
        return guildDB;
    } else {
        guildDB = new GuildModel({
            id: gID
        });
        await guildDB.save().catch(err => console.log(err));
        return guildDB;
    }
};


client.logError = async function(message, errorMsg, ...ExtraError)
{
    let errorMsgToSend = `
            Got an error. 
            Guild infos: {
                Guild id: ${message ? message.guild : "Message empty. got an non command or message error."}
                Guild Name: ${message ? message.guild.name : "Message empty. got an non command or message error."}
            }
            Message: ${message ? message.content : "Message empty. got an non command or message error."}
            Error: {
                Error Message: ${errorMsg}
                More Details:
                 ${(ExtraError) ? JSON.stringify(ExtraError, null, '  ') : "None."}
            }`;
    await fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
    await client.botAuthor.send(new MessageEmbed()
        .setColor("DARK_RED")
        .setDescription(errorMsgToSend))
//        .setThumbnail( message.guild.iconURL).then(m => m.delete({timeout: 2500}));
}

client.addWarning = async function (message, user, reason){
    console.log(user)
    const id = nano.customAlphabet(message.id + message.guild.id + await user.id + "WARNINGSYSTEM" +  await user.username + message.author.name + message.author.discriminator, 21);
    const req = await client.getGuildDB(message.guild.id);
    console.log(await user.user)
    req.warnings.push({reason: reason, userID: await user.id, id: id().toString(), creatorID: message.author.id, creationTime: Date.now()});
    req.save();
    await message.channel.send(new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Success! ✅")
        .setDescription(`Created a warning with the id: \`${id()}\` and the reason: \`${reason}\` for the user: ${await user.user}`)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    ).then(m => m.delete({timeout: 6500}));
};

client.deleteWarning = async function (message, id){
    const req = await client.getGuildDB(id);
    let filteredWarn = req.warnings.filter(i => i.id === id);
    req.warnings = req.warnings.filter(i => i.id !== id);
    req.save();
    await message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setTitle("Success! ✅")
        .setDescription(`Removed the Warning with the id: ${id}. (Warn Reason: ${filteredWarn})`)
        .setThumbnail(message.author.displayAvatarURL())
    ).then(m => m.delete({timeout: 6500}));
};

/*
Prototyping to add extra functions.
 */
Boolean.prototype.parseFromString = function (i){
    return i === "1" || i === "true";
};

Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

String.prototype.chunk = function(size) {
    return this.match(new RegExp('.{1,' + size + '}', 'g'));
};

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

String.prototype.convertStringToArray = function (maxPartSize){
    const reg = new RegExp(".{1,"+maxPartSize+"}", "g");
    return this.match(reg);
};

client.on("guildCreate", async (guild) => {
    let c = new GuildModel({id: guild.id});
    c.save().catch(e => console.log(e));
});

client.on("guildDelete", async (guild) => {
    await GuildModel.findOneAndDelete({id: guild.id});
})



client.on("ready", () => {
   console.log("Done. Logged in as: "+client.user.tag);

    client.user.setPresence({
        activity: { name: `rr!help | Tag me on a guild to see the guild prefix! ${client.guilds.cache.size}`, type: "LISTENING" },
        status: "online"
    });
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    const req = await client.getGuildDB(message.guild.id);
    let prefix = req.prefix;

    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    if(command) {
        if (command.permissions) {
            const membercmd = await message.member;
            if (command.permissions !== "AUTHOR" && command.permissions !== "EVERYONE" && membercmd.hasPermission(command.permissions) || command.permissions !== "AUTHOR" && command.permissions === "EVERYONE") {
                command.run(client, message, args);
                // } else if(message.author.id === (await client.botAuthor).id && results[0].authorShouldSkipPermissionCheck){
                //     if(client.booleanFromString(results[0].authorShouldSkipPermissionCheck)){
                //         command.run(client, message, args);
                //         await message.reply("Executed because you are my author. and owner has not disabled the skip flag yet.")
                //     }
                // }
            } else if (command.permissions === "AUTHOR") {
                if (message.author.id === (await client.botAuthor).id) {
                    command.run(client, message, args);
                } else {
                    await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\` (Only the bot Author can use these commands!)`);
                }
            } else {
                await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\``);
            }
        } else {
            command.run(client, message, args);
        }

        if (message.author.id !== (await client.botAuthor).id) {
            const embed = new MessageEmbed()
                .setTitle("Command executed")
                .setThumbnail(message.guild.iconURL({size: 4096, dynamic: true, format: "png"}))
                .addField("Server", message.guild.name, true)
                .addField("Server ID", message.guild.id, true)
                .addField("User", message.author.tag)
                .addField("Message", message.content);

            client.guilds.cache
                .get("673161309591830541")
                .channels.cache.get("673244212430635019")
                .send(embed);
        }
    }
    
});

process.on("error", e => client.logError(null, "Process got a error.", e));


(async () => {
    await connect(config.database.login.url, {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(client.login(config.discord.token));
})()