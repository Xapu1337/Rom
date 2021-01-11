const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "mqueue",
    aliases: ["curqueue", "cqu", "queue"],
    category: "music-commands",
    description: "Current queue",
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
        if(client.player.isPlaying(message)){
            message.channel.send("\`Sending queue...\`").then(async value => value.channel.send(await getQueueEmbed()));
        } else {
            message.reply("Currently there is nothing playing.")
        }
    }
}