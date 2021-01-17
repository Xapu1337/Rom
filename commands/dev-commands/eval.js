const { inspect } = require('util');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "eval",
    aliases: [""],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "eval <args>",
    permissions: "DEVS",
    run: async(client, message, args) => {
        message.channel.send(client.snowapi.discordToken());
        try {
            let codein = args.join(" ");
            let code = eval(codein);

            if (typeof code !== 'string')
                code = require('util').inspect(code, { depth: 0 });
            let embed = new MessageEmbed()
                .setAuthor(`Eval`)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
                .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
            message.channel.send(embed)
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }

    }
}