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
        let mem = await client.extendedMemberSearch(message, args, 1);
        switch (args[0].toLowerCase()){
            case "add":
                client.addWarning(message, mem, args.split(1).join(" ")).then(i => console.log(i));
                break;
            case "remove":
                client.deleteWarning(message, args[1]).then(i => console.log(i));
                break;
            case "getwarns":
                let reasonIdMix = [];
                let req = await client.getGuildDB(message.guild.id);
                req.warnings.filter((i) => i.userID === mem.id).forEach(i => {
                    reasonIdMix.push(i.id+" Reason: \""+i.reason+"\"");
                });
                console.log(mem)
                console.log(mem + "ARGS 1")
                await message.channel.send(new MessageEmbed()
                    .addField(`Warns from: ${mem.username}`, reasonIdMix.join("\n"), true)
                    .setColor(await client.getColorFromUserId(mem))
                    .setThumbnail(mem.user.displayAvatarURL())
                    .setFooter(`Called from the user: ${message.author.username}`));
                break;
        }
    }
}