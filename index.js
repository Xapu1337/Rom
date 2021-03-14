const config = require("./config.json");
const GuildModel = require("./utils/GuildSchema");
const { ecoMathAcc,
    getEcoAcc,
    successEmbed,
    errorEmbed,
    promptMessage,
    formatDate,
    addWarning,
    deleteWarning,
    extendedMemberSearch,
    getMember,
    getColorFromUserId,
    getQueueEmbed,
    logError,
    getGuildDB,
    verifyUser } = require("./utils/utils");
const { connect } = require("mongoose");
const { Client, MessageEmbed, Collection, Message } = require("discord.js");
const client = new Client({
    ws: { properties: { $device: "Discord iOS" }},
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS',
        'GUILD_INTEGRATIONS',
        'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
    ],
    allowedMentions: ["roles", "users"],
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER','MESSAGE', 'REACTION']});
const fs = require("fs");
const colors = require("colors");
const snowModule = require("snowflake-api").Client;
const snowClient = new snowModule("MTg4OTg4NDU1NTU0OTA4MTYw.MTYwOTY4NTA1NTYwNQ==.bd278b074d53f1f324f6fe9a8f842993");
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
client.utilFeatures = {
    ecoMathAcc,
    getEcoAcc,
    successEmbed,
    errorEmbed,
    promptMessage,
    formatDate,
    addWarning,
    deleteWarning,
    extendedMemberSearch,
    getMember,
    getColorFromUserId,
    getQueueEmbed,
    logError,
    getGuildDB,
    verifyUser,
};


/*
Public vars. accesable via Client.
 */


let searchTrys = 0;
let searchMessage;
client.player = player
.on("error", async (err, message) => {
   //await message.reply("Something went wrong. Try it again");
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
        .setColor(await client.utilFeatures.getColorFromUserId(message.author, client))
    searchMessage = await message.channel.send(embed);

})
.on('searchInvalidResponse', async(message, query, tracks, content, collector) => {
    if (content.toLowerCase() === 'cancel') {
        await searchMessage.delete();
        return message.channel.send('Search cancelled!')
    }

    if(searchTrys > 2){
        await message.channel.send("Search failed 3 times, Aborting current search...").then(async() => {
            collector.stop();
        });
        await searchMessage.delete();
        return;
    }

    await message.channel.send(`Please provide a number between 1 and ${tracks.length}! try ${searchTrys + 1} / 3`);
    searchTrys += 1;

})
.on('searchCancel', async(message) => {
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










/*
Prototyping to add extra functions.
 */
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


client.on("message", async (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;
    const req = await client.utilFeatures.getGuildDB(message.guild.id, client);
    let prefix = req.prefix;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
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
                    case "VERIFIED":
                        if (await client.verifyUser(message.author.id, false) || message.author.id === (await client.botAuthor).id) { // message.author.id === (await client.botAuthor).id ||
                        command.run(client, message, args);
                        } else {
                            await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\` (only selected users can use this command!)`);
                        }
                        break;
                    case "EVERYONE":
                        command.run(client, message, args);
                        break;
                    default:
                        if(message.member.permissions.has(command.permissions)){
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
// client.on('raw', async packet => {
//
//     // We don't want this to run on unrelated packets
//     if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
//     // Grab the channel to check the message from
//     const channel = client.channels.cache.get(packet.d.channel_id);
//     // There's no need to emit if the message is cached, because the event will fire anyway for that
//     if (channel.messages.cache.has(packet.d.message_id)) return;
//
//     // Since we have confirmed the message is not cached, let's fetch it
//     const message =
//         channel.messages.cache.get(packet.d.message_id) ||
//         (await channel.messages.fetch(packet.d.message_id));
//
//         // Emojis can have identifiers of name:id format, so we have to account for that case as well
//         const emoji = packet.d.emoji.id ? packet.d.emoji.id : packet.d.emoji.name; // ${packet.d.emoji.name}:
//
//         // This gives us the reaction we need to emit the event properly, in top of the message object
//         const reaction = await message.reactions.cache.get(emoji);
//         // // Adds the currently reacting user to the reaction's users collection.
//         // if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
//         // Check which type of event it is before emitting
//         if (packet.t === 'MESSAGE_REACTION_ADD') {
//             client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
//         }
//         if (packet.t === 'MESSAGE_REACTION_REMOVE') {
//             client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
//         }
// });


client.on('messageReactionAdd', async (reaction, user)=>{
    if(reaction.message.partial)
        await reaction.message.fetch()
    if(user.bot) return;
    if(!reaction.message.guild.me.permissions.has("MANAGE_ROLES")) return; // permission check.

    let emote = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;

    let req = await client.utilFeatures.getGuildDB(reaction.message.guild.id);

    if(req){
        let role = await req.reactionRoles.filter(rr => rr.messageID === reaction.message.id && rr.emoteID === emote);
        if(role === [] || !role || !role[0]) return;
         let member = reaction.message.guild.members.cache.find(value => value.id === user.id);
        // if(!reaction.message.member.roles.cache.has(role[0].roleID))
            await member.roles.add(role[0].roleID);
    }
});

client.ws.on('INTERACTION_CREATE', async interaction => {

    if(!interaction.guild_id){ // if not within an guild, abort
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 3,
                data: {
                    flags: 64,
                    content: "Slash commands are currently only working within an guild."
                }
            }
        });
        return;
    }

    let message = new Message(client, interaction, (await client.guilds.fetch(interaction.guild_id)).channels.cache.get(interaction.channel_id));
    if(message.guild.members.fetch(interaction.member.user.id).partial)
        await message.guild.members.fetch(interaction.member.user.id).fetch() // Don't ask...
    message.author = (await (await message.guild.members.fetch(interaction.member.user.id)).fetch()).user;

    if(message.author.bot)
        return;

   switch (interaction.data.name.toLowerCase()) {
       case "ping":
           client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                   type: 4,
                   data: {
                       content: `🏓 Pong reaction time: \`${message.createdTimestamp - Date.now()}ms\``
                   }
               }
           })
           break;
       case "chatbot":
           if(!interaction.data.options[0])
               client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                       type: 3,
                       data: {
                           flags: 64,
                           content: `Please give me an message.`
                       }
                   }
               });
           else
           client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                   type: 4,
                   data: {
                       content: await client.snowapi.chatbot({name: "rom", gender: "male", user: interaction.member.user.username, message: interaction.data.options[0].value})
                   }
               }
           });
           break;
       case "music":
           switch (interaction.data.options[0].name) {
               case "play":
                   client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                           type: 2,
                       }
                   });
                   await client.player.play(message, interaction.data.options[0].options[0].value).then(async() => {
                       try {
                           await message.channel.send(await client.utilFeatures.getQueueEmbed(message, client));
                       } catch (e) {
                           console.log(e);
                       }
                   });
               break;
               case "stop":
                   await client.player.stop(message);
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: "✔ | Stopping..."
                           }
                       }
                   });
                   break;
               case "pause":
                   await client.player.pause(message);
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                   data: {
                       type: 3,
                       data: {
                           flags: 64,
                           content: "✔ | Pausing..."
                       }
                    }
                   });
                   break;
               case "resume":
                   await client.player.resume(message);
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: "✔ | Resuming..."
                           }
                       }
                   });
                   break;
               case "progress":
                   if(!client.player.isPlaying(message)){
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: "❌ | Nothing is playing..."
                           }
                       }
                   });
                   break;
               }
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: `\`\`\`${await client.player.createProgressBar(message, {timecodes: true})}\`\`\``
                           }
                       }
                   });
                   break;
               case "queue":
                   if(!client.player.isPlaying(message)){
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: "❌ | The queue is empty."
                           }
                       }
                   });
                   break;
               }
                    await message.channel.send( await client.utilFeatures.getQueueEmbed(message, client));
                   break;
               case "vol":
                   let vol = Number(interaction.data.options[0].options[0].value);
                   if(vol > 101 || vol < 0 )
                       client.api.interactions(interaction.id, interaction.token).callback.post({
                           data: {
                               type: 3,
                               data: {
                                   flags: 64,
                                   content: "❌ Please provide an number between 0 and 100."
                               }
                           }
                       });
                   await client.player.setVolume(message, vol);
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                   data: {
                       type: 3,
                       data: {
                           flags: 64,
                           content: `Volume got changed to ${vol}`
                       }
                   }
               });
                   break;
               case "repeat":
                   let bool = Boolean(interaction.data.options[0].options[0].value);
                   await client.player.setRepeatMode(message, bool);
                   client.api.interactions(interaction.id, interaction.token).callback.post({
                       data: {
                           type: 3,
                           data: {
                               flags: 64,
                               content: `✔ | Repeat mode is set to: ${bool ? "enabled" : "disabled"}`
                           }
                       }
                   });
                   break;
               case "skip":
                   await client.player.skip(message);
                       client.api.interactions(interaction.id, interaction.token).callback.post({
                           data: {
                               type: 3,
                               data: {
                                   flags: 64,
                                   content: "✔ | Skipping..."
                               }
                           }
                       });
                   break;
           }
           //
           // await client.player.play(message, interaction.data.options[0].value).then(async song => {
           //     try {
           //         await message.channel.send(await client.getQueueEmbed(message));
           //     } catch (e) {
           //         console.log(e);
           //     }
           // });
           break;
   }
})

client.on('messageReactionRemove', async (reaction, user)=>{
    if(reaction.message.partial)
        await reaction.message.fetch()
    if(user.bot) return;
    if(!reaction.message.guild.me.permissions.has("MANAGE_ROLES")) return; // permission check.


    let emote = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;

    let req = await client.utilFeatures.getGuildDB(reaction.message.guild.id);

    if(req){
        let role = await req.reactionRoles.filter(rr => rr.messageID === reaction.message.id && rr.emoteID === emote);
        if(role === [] || !role || !role[0]) return;
        let member = reaction.message.guild.members.cache.find(value => value.id === user.id);
            await member.roles.remove(role[0].roleID);
    }
})


process.on('unhandledRejection', (e) => {
    client.utilFeatures.logError(client, null, "unhandledRejection", e);
    console.log('UNHANDLED_REJECTION: ', e);
});

process.on('uncaughtException', (e) => {
    console.log('UNCAUGHT_EXCEPTION: ', e);
    client.utilFeatures.logError(client, null, "uncaughtException", e);
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