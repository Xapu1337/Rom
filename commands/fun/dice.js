const { customAlphabet } = require('nanoid');
const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "dice",
    aliases: [],
    category: "fun",
    description: "Result an dice msg",
    usage: "",
    permissions: "EVERYONE",
    run: async (client, message, args) => {
    
    const nanoid = customAlphabet('123456', 1)
    let dice = new MessageEmbed()
    .setTimestamp()
    .setColor(await client.getColorFromUserId(message.author))
    .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setDescription(`🎲 | Your random dice is: ${nanoid()}`)
    message.channel.send(dice);
  }
 }