const { customAlphabet } = require('nanoid');
const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "dice",
    aliases: [],
    category: "fun",
    description: "Result an dice msg",
    usage: "",
    permissions: "EVERYONE",
    run: (client, message, args) => {
    
    const nanoid = customAlphabet('123456', 1)
    let dice = new MessageEmbed()
    .setTimestamp()
    .setColor("#4c00e6")
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`🎲 | Your random dice is: ${nanoid()}`)
    message.channel.send(dice);
  }
 }