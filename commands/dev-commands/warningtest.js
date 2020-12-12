const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "warningtesting",
    aliases: ["wt", "warntest"],
    category: "dev-commands",
    description: "Command description",
    usage: "[args input]",
    hidden: true,
    permissions: "AUTHOR",
    run: async (client, message, args) => {
        let mem = client.extendedMemberSearch(message, args, 1)
        switch (args[0].toLowerCase()){
            case "add":
                client.addWarning(message, client.extendedMemberSearch(message, args, 1), args.remove(args[1]).join(" ") != null ? args.remove(args[1]).join(" ") : "Nothing.").then(i => console.log(i));
                break;
            case "remove":
                client.deleteWarning(message, args[1]).then(i => console.log(i));
                break;
            case "getwarns":
                let reasonIdMix = [];
                let req = await client.getGuildDB(message.guild.id);
                req.warnings.filter((i) => i.userID === client.extendedMemberSearch(message, args, 0).id).forEach(i => {
                    reasonIdMix.push(`\`${i.id}\` - Reason: \`${i.reason}\``);
                });
                await message.channel.send(new MessageEmbed()
                    .addField(`Warns from: ${client.extendedMemberSearch(message, args, 1).username}`, reasonIdMix.join("\n"), true)
                    .setColor(await client.getColorFromUserId(await client.extendedMemberSearch(message, args, 1)))
                    .setFooter(`Called from the user: ${message.author.username}`));
                break;
        }
    }
}