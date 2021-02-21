const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "eco",
    aliases: ["economy", "ecot"],
    category: "dev-commands",
    description: "Command description",
    usage: "[args input]",
    hidden: true,
    permissions: "AUTHOR",
    run: async (client, message, args) => {
        let user = await client.extendedMemberSearch(message, args, 1);
        if(!user)
            return;
        switch (args[0].toLowerCase()){
            case "get":
                let eco = await client.ECO.getEcoAcc(client, message.guild.id, user.id);
                if(!eco[0])
                    return;
                message.reply(`${user.user.username}'s balance is: ${eco[0].money}`);
                break;
            case "add":
                await client.ECO.ecoMathAcc(client, message.guild.id, user.id, args[2], args[3])
                break;
        }
    }
}