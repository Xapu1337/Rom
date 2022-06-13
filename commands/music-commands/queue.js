// const { MessageEmbed } = require("discord.js");
// module.exports = {
//     name: "mqueue",
//     aliases: ["curqueue", "cqu", "queue"],
//     category: "music-commands",
//     description: "Current queue",
//     usage: "[args input]",
//     hidden: false,
//     permissions: "EVERYONE",
//     run: async(client, message, args) => {
//         const getQueueEmbed = async () => {
//             let queue = await client.player.getQueue(message);
//             if(!queue)
//                 return "Current queue is empty";
//             let ql = (queue.tracks.map((song, i) => {
//                 return `${i === 0 ? 'Now Playing' : `\`#${i+1}\``} - \`${song.title}\`${song.author ?  ` | \`${song.author}\`` : ""} (${song.duration})`
//             })).join("\n");
//             let embed = new MessageEmbed()
//                 .setColor(await client.getColorFromUserId(message.member))
//                 .setFooter(`A request from: ${message.author.username}`)
//                 .setTimestamp()
//                 .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
//                 .setDescription(ql.length >= 2048 ? "Splitting into fields..." : ql);
//             if(ql.length >= 2048){
//                 let qql = ql.convertStringToArray(1024);
//                 qql.forEach(i => {
//                     embed.addField(client.charList.EMPTY, i);
//                 });
//             }
//             return embed;
//         };
//         await message.channel.send(await getQueueEmbed());
//     }
// }