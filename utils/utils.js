const {MessageEmbed} = require("discord.js");
const guildSchema = require("../utils/GuildSchema")
module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();
        let target = message.guild.members.cache.get(toFind);
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if (!target)
            target = "NOT_FOUND";

        return target;
    },

    errorEmbed: function (title, message, discord){
      return new MessageEmbed
          .setTitle("Error while executing.")
          .addField("\u200B", message, true)
          .setColor("DARK_RED")
          .setThumbnail("https://cdn.discordapp.com/attachments/673161310145609750/777529948956524544/668146823231307776.png");
    },

    successEmbed: function (message, discord){
        return new MessageEmbed
            .setTitle("Successfully executed.")
            .addField("\u200B", message, true)
            .setColor("GREEN")
            .setThumbnail("https://cdn.discordapp.com/attachments/673161310145609750/777530510817361920/761174767016476692.gif");
    },


    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    ecoMathAcc: async function (client, guildID, userID, amount, operator){
        let req = await client.getGuildDB(guildID);
        amount = Number(amount); // else its a string.
        if(!req || !userID)
            return;
        let userAcc = await req.eco.filter(value => value.userID === userID);
        if(!userAcc[0])
            await req.eco.push({userID, money: 0});
        console.log(userAcc)

        switch(operator){
            case "+":
                userAcc[0].money = userAcc[0].money + amount;
                break;
            case "-":
                userAcc[0].money = userAcc[0].money - amount;
                break;
            case "/":
                userAcc[0].money = userAcc[0].money / amount;
                break;
            case "*":
                userAcc[0].money = userAcc[0].money * amount;
                break;
            case "^":
                userAcc[0].money = userAcc[0].money ^ amount;
                break;
            case "=":
                userAcc[0].money = amount;
                break;
            case "%":
                userAcc[0].money = userAcc[0].money % amount;
                break;
            default:
                console.log("Fucker forget the operator in the eco math function.");
                break;
        }
        // console.log(req.eco);
        // console.log(userAcc.money);
        // guildSchema.updateOne({'eco.userId': 2}, {'$set': {
        //         'eco.$.money': userAcc.money,
        //     }
        // });
        // console.log(req.eco);
        await req.save();
    },

    getEcoAcc: async function (client, guildID, userID){
        let req = await client.getGuildDB(guildID);
        let userEco = await req.eco.filter(value => value.userID === userID);
        if(!req || !userID){
            return;
        }
        if (!userEco || userEco === [] || userEco.length < 0 || !userEco[0]) {
            let b = req.eco.push({userID, money: 0});
            req.save();
            return b;
        } else {
            return req.eco.filter(value => value.userID === userID);
        }
    },

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }
};