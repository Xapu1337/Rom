const evalm  = require('mathjs');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "matheval",
    aliases: ["me", "meval"],
    category: "fun",
    description: "Can't tell u",
    usage: "matheval <args>",
    permissions: "EVERYONE",
    run: async(client, message, args) => {

        try {
            let codein = args.join(" ");
            let code = await evalm.evaluate(codein);
            let embed = new MessageEmbed()
                .setAuthor(`Mathematical eval`)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
                .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
            await message.channel.send(await embed)
        } catch (e) {
            await message.channel.send(`\`\`\`js\n${await e}\n\`\`\``);
        }

    }
}