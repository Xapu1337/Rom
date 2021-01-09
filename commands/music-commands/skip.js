const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "mskip",
    aliases: ["skipmusic", "mskp", "skip"],
    category: "music-commands",
    description: "Play musik fucker",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: async(client, message, args) => {
        const getQueueEmbed = async () => {
            let queue = await client.player.getQueue(message.guild.id);
            return new MessageEmbed()
                .setColor(await client.getColorFromUserId(message.member))
                .setFooter(`An request from: ${message.author.username}`)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addField(`Current queue: `, (queue.songs.map((song, i) => {
                    return `${i === 0 ? 'Now Playing' : `#${i+1}`} - [${song.name}](${song.url}) | \`${song.author.name}\``
                }).join('\n')));
        };
        if(!message.member.voice.channel){
            message.reply("You aren't in an Voice channel.");
            return;
        }
        // if(!message.member.voice.channel.joinable){
        //     message.reply("Couldn't join. (Missing permissions?)");
        //     return;
        // }
        // if(message.member.voice.channel.full){
        //     message.reply("Your channel is full. Can't join.");
        //     return;
        // }
        if (client.player.isPlaying(message.guild.id)) {
            let s = await client.player.skip(message.guild.id);
            message.reply(`${s.name} has been skipped.`);
        } else {
            message.reply("Nothing is playing. can't skip.");
        }

    }
}