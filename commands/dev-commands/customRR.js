const { inspect } = require('util');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "customrolereaction",
    aliases: ["crr", "customrr"],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "yeet <args>",
    permissions: "AUTHOR",
    run: async(client, message, args) => {


        if(!((await message.guild.members.fetch(client.user.id)).hasPermission("MANAGE_ROLES"))) return message.reply("I Don't have the permissions to give the role.");

        await message.channel.send("Enter the message ID.");
        let answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max:1})
        let msgID = (answer.map(answers=>answers.content).join())

        await message.channel.send("Mention the role.");
        answer = await message.channel.awaitMessages(answer => answer.content,{max: 1}).then((collected)=>{
            roleid =collected.first().content.slice(3,-1);
        })

        await message.channel.send("Enter the emoji to be used.")
        answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1});
        let emoji = (answer.map(answers => answers.content).join())
        let emoid = emoji.slice(1,-1)
        emoid = emoid.split(':')
        emoid = emoid[2] ? emoid[2] : emoid[1];



        message.channel.messages.fetch({around: msgID, limit: 1}).then(messages => {

            messages.first().react(emoji)

        });



        let req = await client.getGuildDB(message.guild.id);
        req.reactionRoles.push({messageID: msgID, roleID: roleid, emoteID: emoid ? emoid : emoji});
        req.save();

    }
}