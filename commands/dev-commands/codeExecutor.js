const paiza_io = require("paiza-io");

const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "meval",
    aliases: [""],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "meval <args>",
    permissions: "VERIFIED",
    run: async(client, message, args) => {

        const awaitCode = (lang, code) => {
            return new Promise((resolve, reject) => {
                paiza_io(lang, code, '', function (error, result) {
                    console.log(lang);
                    if (error) {
                        reject(error);
                    }
                    resolve(result.stdout);
                });
            });
        }

        try {
            let code = await awaitCode(args[0], args.remove(args[0]).join(" "));

            let embed = new MessageEmbed()
                .setAuthor(`LANG Eval`)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`\n${args.join(" ")}\`\`\``)
                .addField(':outbox_tray: Output', `\`\`\`\n${code}\n\`\`\``);
            await message.channel.send(await embed);
        } catch (e) {
            await message.channel.send(`\`\`\`js\n${await e}\n\`\`\``);
            console.log(e);
        }
    
    }
}
