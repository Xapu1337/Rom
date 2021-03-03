const axios = require('axios');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    name: "gt",
    aliases: ["google", "googletest"],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "",
    permissions: "VERIFIED",
    run: async(client, message, args) => {
        let match = args[0].match(/^\d{17,19}$/);
        let gKey = 'AIzaSyBkRTgKXgPIIesUSzOMmqz5AN27445jRNI';
        let csx = 'cde3a759c2d5d7ccb';
        let query;
        if(!match){
            query = args.join(' ');
        }else {
            query = (await (await message.channel.messages.fetch(match[0])).fetch()).content;
        }

        if(!query) return message.channel.send('Please enter your search term!');

        href = await search(query);
        if(!href) return message.channel.send("Unknown Search.");

        message.channel.send(new MessageEmbed()
            .setTitle(`Search results for \`${query}\``)
            .setDescription(href.snippet)
            .setURL(href.link)
            .setColor('#2eabff'));
        async function search(query)
        {
            const { data } = await axios.get("https://www.googleapis.com/customsearch/v1", {params: { key: gKey, cx: csx, safe: 'off', q: query}});

            // console.log(await data.queries);
            // console.log(await data.queries.request);
             if(!data.items) return null;
                return data.items[0];
        }

    }
}