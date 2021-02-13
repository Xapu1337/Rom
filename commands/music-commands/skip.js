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
        if (client.player.isPlaying(message)) {
            await client.player.skip(message);
            message.channel.send(await client.getQueueEmbed(message));
        } else {
            message.reply("Nothing is playing. Can't skip.");
        }

    }
}