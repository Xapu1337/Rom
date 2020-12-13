const { MessageEmbed } = require("discord.js");
function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}
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
                client.addWarning(message, await client.extendedMemberSearch(message, args, 1), ( args.remove(args[1]).remove(args[0]).join(" ").length > 0) ?  args.remove(args[1]).remove(args[0]).join(" ") : "Nothing.");
                break;
            case "remove":
                client.deleteWarning(message, args[1]).then(i => console.log(i));
                break;
            case "getwarns":
                let reasonIdMix = [];
                let req = await client.getGuildDB(message.guild.id);
                req.warnings.filter(async(i) => await i.userID === await client.extendedMemberSearch(message, args, 0).id).forEach(i => {
                    reasonIdMix.push(`\`${i.id}\` - Reason: \`${i.reason}\``);
                });
                let embed = new MessageEmbed()
                    .setColor(await client.getColorFromUserId(await client.extendedMemberSearch(message, args, 1)))
                    .setFooter(`Called from the user: ${message.author.username}`);
                embed.spliceFields( reasonIdMix.join("\n").length/1024,0,{
                    name: `Warns from: ${client.extendedMemberSearch(message, args, 1).username}`,
                    value: reasonIdMix.join("\n")
                });
                await message.channel.send(embed);
                break;
        }
    }
}