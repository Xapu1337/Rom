const {MessageEmbed} = require("discord.js");
const {fetch} = require("node-fetch");

module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();
        let target = message.guild.members.get(toFind);
        if (!target && message.mentions.members)
            target = message.mentions.members.first();
        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if (!target)
            target = message.member;

        return target;
    },

    logError: function(message, client, ...ExtraError)
        {
            let errorMsgToSend = `Got an error. 
            Guild infos: {
            Guild id: ${message.guild.id}
            Guild Name: ${message.guild.name}
            }
            Message: ${message.content}
            More Details:
             ${(ExtraError) ? "None." : ExtraError}
            `;
            fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
            client.botAuthor.send(new MessageEmbed()
                .setColor("DARK_RED")
                .setDescription(errorMsgToSend))
                .setThumbnail(message.guild.iconURL);
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

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }
};