const { inspect } = require('util');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "eval",
    aliases: [""],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "eval <args>",
    permissions: "VERIFIED",
    run: async(client, message, args) => {
        client.destroy = null;
        client.login = null;
        try {
            let codein = args.join(" ");
            //let code = await eval("(async () => {" + codein + "})()");
            let code = await eval(codein);
            // if (typeof code !== 'string')
            //     code = await require('util').inspect(code, { depth: 0});
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