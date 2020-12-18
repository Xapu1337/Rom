module.exports = {
    name: "play",
    aliases: ["playmusic", "ply"],
    category: "music-commands",
    description: "Play musik fucker",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: async(client, message, args) => {
        if (client.player.isPlaying(message.guild.id)) {
            await client.player.addToQueue(message.guild.id, args.join(" ")).then(async song => {
                if (song.error) throw(song.error);
                message.channel.send(`Song ${song.song.name} was added to the queue!`);
            }).catch(err => {
                if(err.type === "SearchIsNull"){
                    message.reply("Nothing found. please search again. or provide an link.");

                } else {
                    client.logError(message, "Error while executing the play command...", err)
                }
            });
        } else {
            await client.player.play(message.member.voice.channel, args.join(" ")).then(async song => {
                if (song.error) throw(song.error);
                message.channel.send(`Playing ${song.song.name}...`);
            }).catch(err => {
                if(err.type === "SearchIsNull"){
                    message.reply("Nothing found. please search again. or provide an link.");

                } else {
                    client.logError(message, "Error while executing the play command...", err)
                }
            });
        }

    }
}