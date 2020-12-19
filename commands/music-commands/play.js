const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "play",
    aliases: ["playmusic", "ply"],
    category: "music-commands",
    description: "Play musik fucker",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: async(client, message, args) => {
        const playStartedEmbed = async (song, isQueue) => {
            return new MessageEmbed()
                .setColor(await client.getColorFromUserId(song.song.requestedBy))
                .setThumbnail(song.song.thumbnail)
                //.setFooter(`An request from: ${song.song.requestedBy.username}`)
                .setTimestamp()
                .addField(isQueue ? "Added to queue" : "Playing...", `[${song.song.name}](${song.song.url}) from \`${song.song.author.name}\``);
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
        if (client.player.isPlaying(message.guild.id)) {
            await client.player.addToQueue(message.guild.id, args.join(" "), {duration: 'short'}, message.member).then(async song => {
                if (song.error) throw(song.error);
                message.channel.send(await playStartedEmbed(song, true));
            }).catch(err => {
                if(err.type === "SearchIsNull"){
                    message.reply("Nothing found. please search again. or provide an link.");

                } else {
                    client.logError(message, "Error while executing the play command...", err)
                    console.log(err)
                }
            });
        } else {
            await client.player.play(message.member.voice.channel, args.join(" "), {duration: 'short'}, message.member).then(async song => {
                if (song.error) throw(song.error);
                message.channel.send(await playStartedEmbed(song, false));
            }).catch(err => {
                if(err.type === "SearchIsNull"){
                    message.reply("Nothing found. please search again. or provide an link.");

                } else {
                    client.logError(message, "Error while executing the play command...", err)
                    console.log(err)
                }
            });
        }

    }
}