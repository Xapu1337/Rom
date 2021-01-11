const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch").default;
module.exports = {
    name: "cat",
    aliases: ["randomcat", "rcat", "pussy"],
    category: "fun",
    description: "Aww <3! who doesn't love cats! (powered by [Snowflake Studio](https://discord.com/invite/2SUybzb))",
    usage: "",
    permissions: "EVERYONE",
    run: async (client, message, args) => {
        // if(!args || !args.join(" ")){
        //     message.reply("Please, enter an message.");
        //     return;
        // }
        message.channel.send(new MessageAttachment(await client.snowapi.cat()))
    }
}