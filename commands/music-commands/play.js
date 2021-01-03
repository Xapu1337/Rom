const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "mplay",
    aliases: ["playmusic", "mply"],
    category: "music-commands",
    description: "Play musik fucker",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: async(client, message, args) => {
        const getQueueEmbed = async () => {
            let queue = await client.player.getQueue(message.guild.id);
            let ql = (queue.songs.map((song, i) => {
                return `${i === 0 ? 'Now Playing' : `\`#${i+1}\``} - \`${song.name}\`${song.author.name ?  ` | \`${song.author.name}\`` : ""}`
            })).join("\n");
            let embed =  new MessageEmbed()
                .setColor(await client.getColorFromUserId(message.member))
                .setFooter(`A request from: ${message.author.username}`)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(ql.length >= 2048 ? "Splitting into fields..." : ql);
            if(ql.length >= 2048){
                let qql = ql.convertStringToArray(1024);
                qql.forEach(i => {
                    embed.addField(client.charList.EMPTY, i);
                });
            }
            return embed;
        };
        if(!message.member.voice.channel){
            message.reply("You aren't in an Voice channel.");
            return;
        }
        if(!message.member.voice.channel.joinable){
            message.reply("Couldn't join. (Missing permissions?)");
            return;
        }
        if(message.member.voice.channel.full){
            message.reply("Your channel is full. Can't join.");
            return;
        }
        let areArgsExisting = args.join(" ") && args.length > 0 && args.join(" ").length > 0
        if(areArgsExisting){
            message.reply(`Searching for \`${args.join(" ")}\`... please wait.`);
            if (client.player.isPlaying(message.guild.id)) {
                await client.player.addToQueue(message.guild.id, args.join(" "), null , message.member).then(async song => {
                    if (song.error) throw(song.error);
                    message.channel.send(`Added: \`${song.song.name}\` to the queue.`);
                    await message.channel.send(await getQueueEmbed());
                }).catch(err => {
                    if(err.type === "SearchIsNull"){
                        message.reply("Nothing found. please search again. or provide an link.");

                    } else {
                        client.logError(message, "Error while executing the play command...", err)
                        console.log(err)
                    }
                });
            } else {
                await client.player.play(message.member.voice.channel, args.join(" "), null, message.member).then(async song => {
                    if (song.error) throw(song.error);
                    message.channel.send(`Playing: \`${song.song.name}\``);
                    try{
                        await message.channel.send(await getQueueEmbed());
                    } catch (e) {
                        console.log(e);
                    }
                }).catch(err => {
                    if(err.type === "SearchIsNull"){
                        message.reply("Nothing found. please search again. or provide an link.");

                    } else {
                        client.logError(message, "Error while executing the play command...", err)
                        console.log(err)
                    }
                });
            }
        } else {
            message.reply("Please provide an song or a youtube link.");

        }
    }
}