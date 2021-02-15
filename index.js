const config = require("./config.json");
const GuildModel = require("./utils/GuildSchema");
const { getMember } = require("./utils/utils");
const { connect } = require("mongoose");
const { Discord, Client, MessageEmbed, Collection, ColorResolvable, GuildMember} = require("discord.js");
const client = new Client({ ws: { properties: { $browser: "Discord iOS" }}, disableMentions: "everyone"});
const fs = require("fs");
const colors = require("colors");
const fetch = require("node-fetch");
const snowModule = require("snowflake-api").Client;
const snowClient = new snowModule("MTg4OTg4NDU1NTU0OTA4MTYw.MTYwOTY4NTA1NTYwNQ==.bd278b074d53f1f324f6fe9a8f842993");
const nano  = require("nanoid");
//const { Player, Util } = require("discord-music-player");
const { Player } = require("discord-player");
const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    leaveOnEndCooldown: 15 * 60,
    autoSelfDeaf: true
});
client.snowapi = snowClient;
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
let searchMessage;
client.getQueueEmbed = async (message) => {
        let queue = await client.player.getQueue(message);
        let ql = (queue.tracks.map((song, i) => {
            return `${i === 0 ? 'Now Playing' : `\`#${i+1}\``} - \`${song.title}\`${song.author ?  ` | \`${song.author}\`` : ""} (${song.duration})`
        })).join("\n");
        let embed = new MessageEmbed()
            .setColor(await client.getColorFromUserId(message.member))
            .setFooter(`A request from: ${message.author.username}`)
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setDescription(ql.length >= 2048 ? "Splitting into fields..." : ql);
        if(ql.length >= 2048){
            let qql = ql.convertStringToArray(1024);
            qql.forEach(i => {
                embed.addField(client.charList.EMPTY, i);
            });
        }
        return embed;
};

let searchTrys = 0;
client.player = player
.on("error", async (err, message) => {
   await message.reply("Something went wrong. Try it again");
   console.log(err);
   await client.logError(message, "Player error not resolved.", err);
})
.on("noResults", async (message, search) => {
    await message.channel.send(`Nothing was found for ${search}`);
})
.on('searchResults', async(message, query, tracks) => {
    const embed = new MessageEmbed()
        .setAuthor(`Here are your search results for ${query}!`)
        .setDescription(tracks.map((t, i) =>
            `\`#${i+1}\` - ${t.title} ${t.author ? ` | \`${t.author}\`` : ""} (${t.duration})`
        ))
        .setFooter('Send the number of the song you want to play!')
        .setColor(await client.getColorFromUserId(message.author))
    searchMessage = await message.channel.send(embed);

})
.on('searchInvalidResponse', async(message, query, tracks, content, collector) => {
    if (content.toLowerCase() === 'cancel') {
        await searchMessage.delete();
        return message.channel.send('Search cancelled!')
    }

    if(searchTrys > 2){
        await message.channel.send("Search failed 3 times, Aborting current search...").then(value => {
            collector.stop();
        });
        await searchMessage.delete();
        return;
    }

    await message.channel.send(`Please provide a number between 1 and ${tracks.length}! try ${searchTrys + 1} / 3`);
    searchTrys += 1;

})
.on('searchCancel', async(message, query, tracks) => {
    await message.channel.send('Response is not valid, canceling...');
    await searchMessage.delete();
})
.on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))
    .on('error', async(error, message) => {
        switch(error){
            case 'NotPlaying':
                await message.channel.send('There is no music being played on this server!')
                break;
            case 'NotConnected':
                await message.channel.send('You are not connected in any voice channel!')
                break;
            case 'UnableToJoin':
                await message.channel.send('I am not able to join your voice channel, please check my permissions!')
                break;
            case 'LiveVideo':
                await message.channel.send('YouTube lives are not supported!')
                break;
            default:
                await message.channel.send(`Something went wrong... Error: ${error}`)
        }
    });





//let Vibrant = require('node-vibrant');
const getColors = require('get-image-colors');

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
    return getMember(message, args[argsIndex]);
}

client.getColorFromUserId = async function (user){
        //let userHex = (await Vibrant.from((await client.users.fetch(user.id)).displayAvatarURL({format: "png"})).getPalette()).Vibrant.hex
        let userHex;
        await getColors((await client.users.fetch(user.id)).displayAvatarURL({format: "png"})).then(value => {
            userHex = value[Math.randomBetween(0, value.length-1)]._rgb;
        });
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

    console.log(errorMsg);
    try{
        await fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
    } catch (e) {
        return;
    }
    await client.botAuthor.send(new MessageEmbed()
        .setColor("DARK_RED")
        .setDescription(errorMsgToSend));
//        .setThumbnail( message.guild.iconURL).then(m => m.delete({timeout: 2500}));
}

client.addWarning = async function (message, user, reason){
    reason = reason.length > 0 ? reason : "None.";
    // if the reason was not included. use "none" else its shit.
    const id = nano.customAlphabet(message.id + message.guild.id + await user.id + "WARNINGSYSTEM" +  await user.username + message.author.name + message.author.discriminator, 21);
    // Cursed way of getting an id. this is actually shit but i don't care and it is kinda unique... i guess.
    const req = await client.getGuildDB(message.guild.id);
    // GET THAT FUCKING MONGODB
    req.warnings.push({reason: reason, userID: await user.id, warnID: id().toString(), creatorID: message.author.id, creationTime: Date.now()});
    // CUKA PUSHING THE ARRAY HARDER THEN THE T-28 THE .308 ANTI TANK ARMOR BULLETS
    req.save();
    // What my parents should do before i were born, make an save game.
    await message.channel.send(new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Success! ✅")
        .setDescription(`Created a warning with the id: \`${id()}\` and the reason: \`${reason}\` for the user: ${await user.user}`)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    ).then(m => m.delete({timeout: 6500}));
    // Send embed that is... s t y l i s h ? and delete after 6.5 seconds.
};

client.deleteWarning = async function (message, id){
    const req = await client.getGuildDB(message.guild.id);
    let filteredWarn = req.warnings.filter(i => i.warnID === id);
    await message.reply(JSON.stringify(filteredWarn));
    if(filteredWarn.length < 0) {
        message.reply(`The warn with the id: \`${id}\` doesn't exist.`);
        return;
    }
    req.warnings = req.warnings.filter(i => i.warnID !== id);
    req.save();
    await message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setTitle("Success! ✅")
        .setDescription(`Removed the Warning with the id: ${id}. (Warn Reason: ${filteredWarn.reason})`)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
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

Math.randomBetween = function (min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
};

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

String.prototype.convertStringToArray = function (maxPartSize){
    const reg = new RegExp("[^]{1,"+maxPartSize+"}", "g");
    return this.match(reg);
};

// setInterval(function () {
//     console.log("heartbeat send.");
// }, 6000);


client.on("guildDelete", async (guild) => {
    await GuildModel.findOneAndDelete({id: guild.id});
})



client.on("ready", () => {
   console.log("Done. Logged in as: "+client.user.tag);

    client.user.setPresence({
        activity: {
            name: `rr!help | Tag me on a guild to see the guild prefix!. Currently on: ${client.guilds.cache.size} servers.`,
            type: "LISTENING",
            url: "https://xapu1337.ml",
        },
        status: "online",
    });
});


const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


client.on("message", async message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    const req = await client.getGuildDB(message.guild.id);
    let prefix = req.prefix;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    if(command) {
        try {
            if (command.permissions) {
                switch (command.permissions) {
                    case "AUTHOR":
                        if (message.author.id === (await client.botAuthor).id) {
                            command.run(client, message, args);
                        } else {
                            await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\` (Only the bot Author can use these commands!)`);
                        }
                        break;
                    case "EVERYONE":
                        command.run(client, message, args);
                        break;
                    default:
                        if(message.member.hasPermission(command.permissions)){
                            command.run(client, message, args);
                        } else {
                            await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\``);
                        }
                        break;
                }
            } else {
                command.run(client, message, args);
            }
        } catch (e) {
            await message.reply(`Something went wrong... this error is logged. try it later again.`);
            await client.logError(message, "Error executing an command...", e);
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

client.on("error", e => {
    client.logError(null, "Client got an error...", e);
    console.log(e);
});

client.on("warn", e => {
    console.log(e);
});

process.on('unhandledRejection', (e) => {
    client.logError(null, "unhandledRejection", e);
    console.log('UNHANDLED_REJECTION: ', e);
});

process.on('uncaughtException', (e) => {
    console.log('UNCAUGHT_EXCEPTION: ', e);
    client.logError(null, "uncaughtException", e);
    console.log('NODE_WARN: ', {
        stack: 'Uncaught Exception detected. Restarting...'
    });
    process.exit(1);
});


(async () => {
    await connect(config.database.login.url, {
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(client.login(config.discord.token));
})()