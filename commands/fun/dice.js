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
    .setColor(await client.getColorFromImage(message.author.id))
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`🎲 | Your random dice is: ${nanoid()}`)
    message.channel.send(dice);
  }
 }