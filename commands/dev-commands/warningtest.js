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
        switch (args[0]){
            case "add":
                client.addWarning(message, args[1], client.extendedMemberSearch(message, args, 2)).then(i => console.log(i));
                break;
            case "remove":
                client.deleteWarning(message, args[1]).then(i => console.log(i));
                break;
            case "getWarningsFromUser":
                let ids = [];
                let reasons = [];
                let req = await client.db.findOne({id: message.guild.id});
                req.warnings.filter((i) => i.userID === client.extendedMemberSearch(message, args, 1).id).forEach(i => {
                    ids.push(i.id);
                    reasons.push(i.reason);
                });
                message.channel.send(new MessageEmbed()
                    .setDescription(`
                    ${ids.join(", ")}
                    (Reasons. Relative to the id:)
                    ${reasons.join(", ")}`));
                break;
        }
    }
}