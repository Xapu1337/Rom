function TimeToMiliseconds(time) {
    let items = time.split(':'),
        s = 0, m = 1;

    while (items.length > 0) {
        s += m * parseInt(items.pop(), 10);
        m *= 60;
    }

    return s * 1000;
}



module.exports = {
    name: "play",
    aliases: ["playmusic", "ply"],
    category: "music-commands",
    description: "Play musik fucker",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: async(client, message, args) => {
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
            await client.player.addToQueue(message.guild.id, args.join(" "), {duration: 'short'}).then(async song => {
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
            await client.player.play(message.member.voice.channel, args.join(" "), {duration: 'short'}).then(async song => {
                if (song.error) throw(song.error);
                message.channel.send(`Playing ${song.song.name}...`);
                console.log(song)
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