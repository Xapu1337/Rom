
const ms = require("ms");
const dt = require("dateformat");
const pms = require('pretty-ms');
module.exports = {
    name: "tempmute",
    aliases: ["tmute", "tmt"],
    category: "moderation",
    description: "Tempmute an member",
    usage: "<mention> <time like 1s/m/h/d",
    permissions: "MANAGE_MESSAGES",
    run: async(client, message, args) => {
        let tomute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!tomute) return message.reply(`User not found.`);
        if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(`Can't mute this person. The permission Manage Messages bypasses it.`);
        let muterole = message.guild.roles.cache.find(role => role.name === "muted");
        if(!muterole){
            try{
                muterole = await message.guild.roles.create({
                    data: {
                    name: "muted",
                    color: "#000000",
                    permissions: []
                    }
                })
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.overwritePermissions([
                        {
                            
                            id: muterole.id,
                            deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                            
                        },
                      ], 'Adding Muted role for the bot.');
                });
            }catch(e){
                console.log(e.stack);
            }
        }
        let mutetime = args[1];
        if(!mutetime) return message.reply(`You didn't specify a time!`);
        if(isNaN(ms(mutetime))) return message.reply(client.embederror(`ERROR! | Your date is not valid!`, message.author.username, message.author.displayAvatarURL(), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`));
        await(tomute.roles.add(muterole.id));
        message.reply(`<@${tomute.id}> has been muted for ${pms(ms(mutetime), {verbose: true})}`).then(m => m.delete({timeout: 5000}));

        setTimeout(function(){
            tomute.roles.remove(muterole.id);
        }, ms(mutetime));
  }
 }