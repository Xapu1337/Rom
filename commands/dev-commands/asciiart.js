const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch").default;
module.exports = {
    name: "asciitest",
    aliases: [],
    category: "dev-commands",
    description: "",
    usage: "",
    permissions: "AUTHOR",
    run: async (client, message, args) => {
        message.channel.send(`\`\`\`${args.join(" ").replace("0", " ").replace("1","█")}`);
    }
}