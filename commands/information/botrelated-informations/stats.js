const os = require("os");
const {MessageEmbed}=require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let cpuStat = require("cpu-stat")
const ms = require("ms")
module.exports = {
    name: "stats",
    aliases: ["statistics"],
    category: "botrelated-informations",
    description: "Displays the bot stats and more!",
    usage: "just 'stats'",
    permissions: "EVERYONE",
    run: (client, message, args, connection) => {
        let emptychar = "\u200B";
        connection.query(
            "SELECT COUNT(*) as commands_runcount FROM runned_commands",
            [message.guild.id],
            async(err, results) => {
              if (err) console.error(err);
              let cpuLol;
            cpuStat.usagePercent(function(err, percent, seconds) {
            if (err) {
                return console.log(err);
            }
            const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            let statsembed = new MessageEmbed()
                .setColor("#a100b8")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setFooter(`Requested from: ${message.author.username}`, message.author.displayAvatarURL())
                .addField(`╭╼╼╼╼╼╼╯ BOT STATS ╰╼╼╼╼╼╼╮`, emptychar)
                .addField("• Uptime", `${duration}`, true)
                .addField(`• Runned commands`,`${results[0].commands_runcount}`, true) // bot commands send
                .addField("• Users", `${client.users.cache.size.toLocaleString()}`, true)
                .addField("• Servers", `${client.guilds.cache.size.toLocaleString()}`, true)
                .addField("• Channels", `${client.channels.cache.size.toLocaleString()}`, true)
                .addField("• Node.js", `${process.version}`, true)
                .addField(`╰╼╼╼╼╼╼╮ BOT STATS ╭╼╼╼╼╼╼╯`, emptychar)
                .addField(`╭╼╼╼╼╼╼╯ OS  STATS ╰╼╼╼╼╼╼╮`,emptychar)
                .addField("• RAM Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
                .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
                .addField("• CPU Usage", `\`${percent.toFixed(2)}%\``, true)
                .addField("• OS Arch", `\`${os.arch()}\``, true)
                .addField("• Platform", `\`\`${os.platform()}\`\``, true)
                .addField(`╰╼╼╼╼╼╼╮ OS STATS ╭╼╼╼╼╼╼╯`, emptychar)
                
                message.channel.send(statsembed);
            });
        }
    );
  }
 }