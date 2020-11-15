const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
let emptychar = "\u200B";
module.exports = {
    name: "help",
    aliases: ["h"],
    category: "information",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    permissions: "EVERYONE",
    hidden: false,
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
            console.log(getAll(client, message));
        }
    }
}
function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField('Emoji Definition:', `
        ⚙️ - This command you run and it will ask for an message, write the Message and it will use the message automatically.`, false)
    const commands = (category) => {

        // Future note: is empty is just an category mismatch
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => cmd.hidden === true ? "" : `\`${cmd.name} ${(cmd.note)?cmd.note:""}(${cmd.permissions})\``)
            .join(", ");
    }

    const info = client.categories
        .remove("dev-commands")
        .map(cat => stripIndents `**${cat[0].toUpperCase() + cat.slice(1)}:** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.permissions) info += `\n**Permissions**: ${cmd.permissions}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Arguments: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("BLUE").setDescription(info));
}