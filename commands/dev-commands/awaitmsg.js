const {MessageEmbed} = require("discord.js");
const dateFormat = require("dateformat");
module.exports = {
    name: "snowflake",
    aliases: [],
    category: "dev-commands",
    description: "DEV TEST",
    usage: "",
    permissions: "AUTHOR",
    run: async(client, message, args) => {
        message.reply(new MessageEmbed()
            .setTitle(`Current information about snowflake. ${await client.snowapi.me().banned ? "*BANNED!*" : ""}`)
            .addField("💎", `Premium? ${await client.snowapi.me().pro ? "***Yes.***" : "*No.*"}`)
            .addField("⏱ Current ratelimit", await client.snowapi.me().ratelimits)
            .addField("⏱ Current requests", await client.snowapi.me().requests)
            .addField("⏲ Token created at ",dateFormat(await client.snowapi.me().tokenCreatedTimestamp, "dd, mm, yyyy | hh:mm:ss"))
            .addField("⏲ Account created at ",dateFormat(await client.snowapi.me().createdTimestamp , "dd, mm, yyyy | hh:mm:ss")));
        console.log(await client.snowapi.me());
  }
 }