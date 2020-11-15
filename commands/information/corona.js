const {MessageEmbed}=require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    name: "corona",
    aliases: ["corstats", "crstats", "coronastatistics"],
    category: "info",
    description: "Gets current corona informations!",
    usage: "showconfig (Thats it.)",
    permissions: "EVERYONE",
    run: async(client, message, args, connection) => {
                fetch('https://covidapi.info/api/v1/global')
                .then(res => res.json())
                .then(response => {
                let coronaStats = new MessageEmbed()
                .setTitle(`Corona stats from the: ${response.date} (These stats are Global.)`)
                .addField(`Cases`, `Confirmed cases: ${response.result.confirmed}\nDeaths: ${response.result.deaths}\nRecovered: ${response.result.recovered}\nMortility rate: ${((response.result.deaths/response.result.confirmed)*100).toFixed(2)} %`) 
                .addField(`Please! Be a good civilian of your country and stay at home!`, `More details. And what to do is [here](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)`)
                .setFooter("Corona stats from 'covidapi.info' and the idea was from the bot 'Dyno'", 'https://cdn.discordapp.com/attachments/239446877953720321/691020838379716698/unknown.png')
                .setColor("#a72b2a")
                .setTimestamp();
                message.channel.send(coronaStats);
            })
  }
}