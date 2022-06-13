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
        let me = await client.snowapi.me();
        message.reply(new MessageEmbed()
            .setTitle(`Current information about the snowflake api account. ${me.banned ? "*BANNED!*" : ""}`)
            .addField("💎", `Premium? ${me.pro ? "***Yes.***" : "*No.*"}`)
            .addField("⏱ Current ratelimit", me.ratelimits)
            .addField("⏱ Current requests", me.requests)
            .addField("⏲ Token created at ",dateFormat(me.tokenCreatedTimestamp, "dd, mm, yyyy | hh:mm:ss"))
            .addField("⏲ Account created at ",dateFormat(me.createdTimestamp , "dd, mm, yyyy | hh:mm:ss"))
            .setColor("#4357a9"));
        console.log(await client.snowapi.me());
  }
 }  