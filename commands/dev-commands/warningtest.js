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
                req.warnings.filter((i) => i.userID === client.extendedMemberSearch(message, args, 1)).forEach(i => {
                    reasonIdMix.push(i.id+" Reason: \""+i.reason+"\"");
                });
                console.log(mem)
                console.log(reasonIdMix.join("\n"))
                await message.channel.send(new MessageEmbed()
                    .addField(`Warns from: ${mem.username}`, `${await reasonIdMix.join("\\n")}`, false)
                    .setColor(await client.getColorFromUserId(mem))
                    .setThumbnail(mem.displayAvatarUrl())
                    .setFooter(`Called from the user: ${message.author.username}`));
                break;
        }
    }
}