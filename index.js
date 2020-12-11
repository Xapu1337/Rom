const config = require("./config.json");
const GuildModel = require("./utils/GuildSchema");
const { Utils } = require("./utils/utils");
const { connect } = require("mongoose");
const { Discord, Client, MessageAttachment, MessageEmbed, Collection, ColorResolvable} = require("discord.js");
const client = new Client({ ws: { properties: { $browser: "Discord iOS" }}, disableMentions: "everyone"});
const fs = require("fs");
const colors = require("colors");
const fetch = require("node-fetch");
const nano  = require("nanoid");
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
    return await message.mentions.members.first() || await message.guild.members.cache.get(args[argsIndex]);
}

client.getColorFromImage = async function (idFromUser){
    return (await Vibrant.from((await client.users.fetch(idFromUser)).displayAvatarURL({size: 4096, format: "png"})).getPalette()).Vibrant.hex
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
                Guild id: ${message.guild.id}
                Guild Name: ${message.guild.name}
            }
            Message: ${message.content}
            Error: {
                Error Message: ${errorMsg}
                More Details:
                 ${(ExtraError) ? ExtraError : "None."}
            }`;
    await fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
    await client.botAuthor.send(new MessageEmbed()
        .setColor("DARK_RED")
        .setDescription(errorMsgToSend))
        .setThumbnail(message.guild.iconURL).then(m => m.delete({timeout: 2500}));
}

client.addWarning = async function (message, reason, user){
    const id = nano.customAlphabet(message.id + message.guild.id + user.id + "WARNINGSYSTEM" + Math.random() * 420 + Math.sqrt(user.id^69) + user.username + message.author.name + message.author.discriminator, 21);
    const req = await client.getGuildDB(message.guild.id);
    req.warnings.push({reason: reason, userID: user.id, id: id().toString(), creatorID: message.author.id, creationTime: Date.now()});
    req.save();
    await message.channel.send(new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Success! ✅")
        .setDescription(`Created a warning with the id: \`${id()}\` and the reason: \`${reason}\` for the user: ${user.name}`)
        .setThumbnail(message.author.displayAvatarURL())
    ).then(m => m.delete({timeout: 2500}));
};

client.deleteWarning = async function (message, id){
    const req = await client.getGuildDB(id);
    let filteredWarn = req.warnings.filter(i => i.id === id);
    req.warnings = req.warnings.filter(i => i.id !== id);
    req.save();
    await message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setTitle("Success! ✅")
        .setDescription(`Removed the Warning with the id: ${id}. (Warn Reason: ${filteredWarn.reason})`)
        .setThumbnail(message.author.displayAvatarURL())
    ).then(m => m.delete({timeout: 2500}));
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


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});




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
    const req = await client.getGuildDB(message.guild.id);
    if(message.author.bot) return;
    if(!message.guild) return;
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



(async () => {
    await connect(config.database.login.url, {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(client.login(config.discord.token));
})()