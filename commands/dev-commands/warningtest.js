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
        let warnTarget = await client.extendedMemberSearch(message, args, 1);
        if(!warnTarget)
            return;
        switch (args[0].toLowerCase()){
            case "add":
                client.addWarning(message, warnTarget, args.remove(args[1]).remove(args[0]).join(" "));
                break;
            case "remove":
                client.deleteWarning(message, args[1]).then(i => console.log(i));
                break;
            case "getwarns":
                let reasonIdMix = [];
                let req = await client.getGuildDB(message.guild.id);

                req.warnings.filter(i => i.userID === warnTarget.id).forEach(i => {
                    reasonIdMix.push(`ID: \`${i.warnID}\` Reason: \`${i.reason.length >= 256 ? i.reason.convertStringToArray(512)[0] + "..."  : i.reason}\``);
                });
                let embed = new MessageEmbed()
                    .setColor(await client.getColorFromUserId(warnTarget))
                    .setTitle("Warns from: " + warnTarget.user.username)
                    .setFooter(`Called from the user: ${message.author.username}`)
                    .setDescription(reasonIdMix.join("\n").length >= 2048 ? "Splitting into fields..." : reasonIdMix.join("\n"));
                if(reasonIdMix.join("\n").length >= 2048){
                    let qql = reasonIdMix.join("\n").convertStringToArray(1024);
                    qql.forEach(i => {
                        embed.addField(client.charList.EMPTY, i);
                    });
                }
//                embed.spliceFields( 2,0,`Warns from: ${client.extendedMemberSearch(message, args, 1).username}`, reasonIdMix.join("\n"));
                await message.channel.send(embed);
                break;
        }
    }
}