const config = require("./config.json");
const GuildModel = require("./utils/GuildSchema");
const { Utils } = require("./utils/utils");
const { connect } = require("mongoose");
const { Discord, Client, MessageAttachment, MessageEmbed, Collection} = require("discord.js");
const client = new Client({ ws: { properties: { $browser: "Discord iOS" }}, disableMentions: "everyone"});
const fs = require("fs");
const { table } = require("table");
const colors = require("colors");
const fetch = require("node-fetch");

/*
Public vars. accesable via Client.
 */
client.utils = Utils;
client.db = GuildModel;
client.botAuthor = await (client.users.fetch("188988455554908160"));
client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.charList = {
    EMPTY: "\u200B"
}

client.getGuildDB = async function (guildID){

    let guildDB = await guildsDB.findOne( { id: guildID } );

    if(guildDB){
        return guildDB;
    } else {
        guildDB = new guildsDB({
            id: guildID
        })
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
                 ${(ExtraError) ? "None." : ExtraError}
            }`;
    await fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
    await client.botAuthor.send(new MessageEmbed()
        .setColor("DARK_RED")
        .setDescription(errorMsgToSend))
        .setThumbnail(message.guild.iconURL);
}

client.addWarning = function (message, reason, user){
    let res = GuildModel.findOne({id: message.guild.id});
    res.warnings.array.set({reason: reason, userID: user.id});
    res.save();
    console.log(res.warnings.array);
}


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

async function checkAndCreate(guildId){
    if(!await GuildModel.findOne({id: guildId})){
        let c = new GuildModel({id: guildId});
        c.save();
    }
}



client.on("guildCreate", async (guild) => {
    await checkAndCreate(guild.id);
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
    const req = await client.db.findOne({id: message.guild.id});
    if(!req){
        await checkAndCreate(message.guild.id);
        if(message.content.startsWith("rr!"))
            await message.reply("Something weird happened, try it again.");
        return;
    }
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