const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch").default;
module.exports = {
    name: "chatbot",
    aliases: ["cbot", "cbo"],
    category: "fun",
    description: "AI chatbot command. (powered by [Snowflake Studio](https://discord.com/invite/2SUybzb))",
    usage: "",
    permissions: "EVERYONE",
    run: async (client, message, args) => {
        if (!args || !args.join(" ")) {
            message.reply("Please enter a message.");
            return;
        }
        try{
            client.snowapi.chatbot({gender: "male", message: args.join(" "), name: "Rom", user: message.author.username}).then(value => {
                message.channel.send(value);
            });
        } catch (e) {
            message.reply("Currently unavailable, please try it later.");
            client.logError(message, "Error: Chatbot", e);
        }
    }
}