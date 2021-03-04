
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
        exec(args.join(" "), (e, out, err) => {
            message.channel.send(`\`${out}\\n${err}\``)
        });
    }
}