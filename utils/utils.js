const {MessageEmbed} = require("discord.js");


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
            target = message.member;

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

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }
};