const { inspect } = require('util');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "eval",
    aliases: [""],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "eval <args>",
    permissions: "AUTHOR",
    run: async(client, message, args) => {

        try {
            let codein = args.join(" ");
            let code = eval("(async () => {" + codein + "})()");

            if (typeof code !== 'string')
                code = require('util').inspect(code, { depth: 0});
            let embed = new MessageEmbed()
                .setAuthor(`Eval`)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
                .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
            await message.channel.send(await embed)
        } catch (e) {
            await message.channel.send(`\`\`\`js\n${await e}\n\`\`\``);
        }

    }
}