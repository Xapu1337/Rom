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
            const embed = new MessageEmbed()
            .setColor(await client.getColorFromUserId(message.author))
            .addField('Emoji Definition:', `
        ⚙️ - This command you run and it will ask for an message, write the message and it will use the message automatically.`, false);

            const commands = (category) => {

                // Future note: is empty is just an category mismatch
                return client.commands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => cmd.hidden === true ? "" : `\`${cmd.name} ${(cmd.note) ? cmd.note : ""}(${cmd.permissions})\``)
                    .join(", ");
            };
            let pages = [];

            const filter = (reaction, user) => {
                return ['◀', '▶'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            client.categories
                .remove("dev-commands")
                .forEach((value) => {
                pages.push({
                    title: stripIndents`**${client.betterCategoryNames.has(value) ? client.betterCategoryNames.get(value) : value[0].toUpperCase() + value.slice(1)}:**`,
                    value: commands(value),
                });
            });

            let options = {
                limit: 15 * 1000,
                min: 0,
                max: pages.length,
                page: 0,
            };

            embed.setTitle(pages[options.page].title)
            embed.setDescription(pages[options.page].value);
            let msg = await message.channel.send(embed);
            await msg.react("▶");
            let collector = msg.createReactionCollector(filter, {time: 60000});

            collector.on("collect", async (reaction) => {
                await msg.reactions.removeAll();
                switch(reaction.emoji.name){
                    case "▶":
                        if(options.page <= options.max){
                            options.page++;
                            embed.setTitle(pages[options.page].title)
                            embed.setDescription(pages[options.page].value);
                            await msg.edit(embed);
                            await msg.react('◀');
                            await msg.react('▶');
                        }
                        break;
                    case "◀":
                        if(options.page >= options.min){
                            options.page--;
                            embed.setTitle(pages[options.page].title)
                            embed.setDescription(pages[options.page].value);
                            await msg.edit(embed);
                            await msg.react('◀');
                            await msg.react('▶');
                        }
                        break;
                }
            });

        }
    }
}


async function getCMD(client, message, input) {
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

    return message.channel.send(embed.setColor(await client.getColorFromUserId(message.author)).setDescription(info));
}