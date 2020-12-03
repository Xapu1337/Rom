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
        console.log(client.getColorFromImage(message.author.displayAvatarURL({size: 4096, format: "png"})));
    let dice = new MessageEmbed()
    .setTimestamp()
    .setColor(client.getColorFromImage(message.author.displayAvatarURL({size: 4096, format: "png"})))
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`🎲 | Your random dice is: ${nanoid()}`)
    message.channel.send(dice);
  }
 }