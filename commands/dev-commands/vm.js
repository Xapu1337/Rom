
const { exec } = require('child_process');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "vme",
    aliases: ["virtualmachine", "vmexecute", "virtualmachinee", "virtualmachineexecute"],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "",
    permissions: "AUTHOR",
    run: async(client, message, args) => {
        try {
            exec(args.join(" "), (e, out, err) => {
                message.channel.send(new MessageEmbed()
                    .setDescription(`\`\`\`${out}\\n${err}\`\`\``))
            });
        } catch (e) {
            message.reply("Message to long.");
        }
    }
}