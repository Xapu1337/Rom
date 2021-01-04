const {MessageEmbed} = require("discord.js");
const dateFormat = require("dateformat");
module.exports = {
    name: "snowflake",
    aliases: [],
    category: "dev-commands",
    description: "DEV TEST",
    usage: "",
    permissions: "AUTHOR",
    run: (client, message, args) => {
        message.reply(new MessageEmbed()
            .setTitle(`Current information about snowflake. ${client.snowapi.me().banned ? "*BANNED!*" : ""}`)
            .addField("💎", `Premium? ${client.snowapi.me().pro ? "***Yes.***" : "*No.*"}`)
            .addField("⏱ Current ratelimit", client.snowapi.me().ratelimits)
            .addField("⏱ Current requests", client.snowapi.me().requests)
            .addField("⏲ Token created at ",dateFormat(client.snowapi.me().tokenCreatedTimestamp, "dd, mm, yyyy | hh:mm:ss"))
            .addField("⏲ Account created at ",dateFormat(client.snowapi.me().createdTimestamp , "dd, mm, yyyy | hh:mm:ss")));
        message.reply(client.snowapi.me());
  }
 }