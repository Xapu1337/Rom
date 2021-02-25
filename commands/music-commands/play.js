// const { MessageEmbed } = require("discord.js");
// module.exports = {
//     name: "mplay",
//     aliases: ["playmusic", "mply", "play"],
//     category: "music-commands",
//     description: "Play musik fucker",
//     usage: "[args input]",
//     hidden: false,
//     permissions: "EVERYONE",
//     run: async(client, message, args) => {
//
//         let areArgsExisting = args.join(" ") && args.length > 0 && args.join(" ").length > 0
//         if(areArgsExisting){
//             message.reply(`Searching for \`${args.join(" ")}\`... please wait.`);
//                 await client.player.play(message, args.join(" ")).then(async song => {
//                     try{
//                         await message.channel.send(await client.getQueueEmbed(message));
//                     } catch (e) {
//                         console.log(e);
//                     }
//             });
//         } else {
//             message.reply("Please provide an song or a youtube link.");
//
//         }
//     }
// }