const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch").default;
module.exports = {
    name: "roast",
    aliases: [],
    category: "fun",
    description: "HEY! THAT'S RUDE! (powered by [Snowflake Studio](https://discord.com/invite/2SUybzb))",
    usage: "",
    permissions: "EVERYONE",
    run: async (client, message, args) => {
        // if(!args || !args.join(" ")){
        //     message.reply("Please, enter an message.");
        //     return;
        // }
        message.channel.send(await client.snowapi.roast())
    }
}