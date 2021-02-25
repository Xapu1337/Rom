// const { MessageEmbed } = require("discord.js");
// module.exports = {
//     name: "mstop",
//     aliases: ["stop", "musicstop", "stopmusic"],
//     category: "music-commands",
//     description: "s t o p.",
//     usage: "[args input]",
//     hidden: false,
//     permissions: "EVERYONE",
//     run: async(client, message, args) => {
//         if(client.player.isPlaying(message)){
//         message.channel.send("Stopping...");
//         client.player.stop(message);
//         } else {
//             message.reply("Can't skip, nothing is playing.");
//         }
//     }
// }