const config = require("./config.json");
const { Client, MessageAttachment, MessageEmbed, Collection} = require("discord.js");
const client = new Client({ ws: { properties: { $browser: "Discord iOS" }}}, {
    disableMentions:"everyone"
    });
const fs = require("fs");
const { table } = require("table");
const colors = require("colors");

/*
Public vars. accesable via Client.
 */
client.botAuthor = client.users.fetch("188988455554908160");
client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.booleanFromString = function (i){
    return i === "1" || i === "true";
};

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});



client.on("ready", () => {
   console.log("Done. Logged in as: "+client.user.tag);

    client.user.setPresence({
        activity: { name: `rr!help | Tag me on a guild to see the guild prefix! ${client.guilds.cache.size}`, type: "LISTENING" },
        status: "online"
    });
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    let prefix = "rr!";

    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    if(command) {
        if (command.permissions) {
            const membercmd = await message.member;
            if (command.permissions !== "AUTHOR" && command.permissions !== "EVERYONE" && membercmd.hasPermission(command.permissions) || command.permissions !== "AUTHOR" && command.permissions === "EVERYONE") {
                command.run(client, message, args);
                // } else if(message.author.id === (await client.botAuthor).id && results[0].authorShouldSkipPermissionCheck){
                //     if(client.booleanFromString(results[0].authorShouldSkipPermissionCheck)){
                //         command.run(client, message, args);
                //         await message.reply("Executed because you are my author. and owner has not disabled the skip flag yet.")
                //     }
                // }
            } else if (command.permissions === "AUTHOR") {
                if (message.author.id === (await client.botAuthor).id) {
                    command.run(client, message, args);
                } else {
                    await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\` (Only the bot Author can use these commands!)`);
                }
            } else {
                await message.reply(`Sorry, you don't have the permission \`\`\`${command.permissions}\`\`\``);
            }
        } else {
            command.run(client, message, args);
        }

        if (message.author.id !== (await client.botAuthor).id) {
            const embed = new MessageEmbed()
                .setTitle("Command executed")
                .setThumbnail(message.guild.iconURL({size: 4096, dynamic: true, format: "png"}))
                .addField("Server", message.guild.name, true)
                .addField("Server ID", message.guild.id, true)
                .addField("User", message.author.tag)
                .addField("Message", message.content);

            client.guilds.cache
                .get("673161309591830541")
                .channels.cache.get("673244212430635019")
                .send(embed);
        }
    }
    
});




client.login(config.discord.token);