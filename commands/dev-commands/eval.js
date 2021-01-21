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
        const waitEval = (ev) => {
            return new Promise((resolve, reject) => {
                eval(ev);
            });
        };
        try {
            let codein = args.join(" ");
            let code = await waitEval(codein) ;

            if (typeof code !== 'string')
                code = await require('util').inspect(await code, { depth: 0});
            let embed = new MessageEmbed()
                .setAuthor(`Eval`)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
                .addField(':outbox_tray: Output', `\`\`\`js\n${await code}\n\`\`\``)
            message.channel.send(await embed)
        } catch (e) {
            message.channel.send(`\`\`\`js\n${await e}\n\`\`\``);
        }

    }
}