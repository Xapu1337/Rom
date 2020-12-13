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
                let res = args.remove(args[1]).remove(args[0]).join(" ");
                console.log(args);
                console.log(res);
                client.addWarning(message,await client.extendedMemberSearch(message, args, 1), (res.length > 0) ? res : "Nothing.");
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
                await message.channel.send(new MessageEmbed()
                    .addField(`Warns from: ${client.extendedMemberSearch(message, args, 1).username}`, reasonIdMix.join("\n"), true)
                    .setColor(await client.getColorFromUserId(await client.extendedMemberSearch(message, args, 1)))
                    .setThumbnail((await client.extendedMemberSearch(message, args, 1).displayAvatarURL()))
                    .setFooter(`Called from the user: ${message.author.username}`));
                break;
        }
    }
}