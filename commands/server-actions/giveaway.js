const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const dateFormat = require("dateformat");
module.exports = {
    name: "giveaway",
    aliases: ["gaw"],
    note: "⚙️",
    category: "server-actions",
    description: "An giveaway command, its self explaining isn't it?",
    usage: "giveaway  <time like 5d, however. max is 1m (1 Month)> <max people to win> <item>",
    permissions: "MANAGE_MESSAGES",
    run: async(client, message, args) => {
        /*                                */
        /*           VARS                 */
        /*                                */
        let item = "";
        let time;
        let winnerCount;
        let finished_time;
        const serverGiveaway = new Set();

        function itemCheck(){
            return new Promise((resolve, reject) => {
                const filter = m => m.author.id === message.author.id;
                message.reply(`Nice! I Just ran the Setup. write the item that people can win! (This expires in 25 seconds! or write 'cancel' or 'abort' to stop!)`).then(r => r.delete({timeout: 25000}));
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 25000
                }).then(collected => {

                    if(collected.first().content === `cancel` || collected.first().content === `abort`){
                        return message.reply(`Your request got canceled!`);
                    }
                    collected.delete()
                    item = collected.first().content;
                    resolve()
                    collected.first().delete()

                }).catch(err => {
                    message.reply("Cancelled...").then(r => r.delete({timeout: 5000}));
                });
            })
        }



        function memberCheck(){
            return new Promise((resolve, reject) => {
                const filter = m => m.author.id === message.author.id;
                message.reply(`Step 2. Write the amount of people that can enter the giveaway! max 100! (This expires in 25 seconds! or write 'cancel' or 'abort' to stop!)`).then(r => r.delete({timeout: 25000}));
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 25000
                }).then(collected => {

                    if(collected.first().content === `cancel` || collected.first().content === `abort`){
                        return message.reply(`Your request got canceled!`);
                    }

                    let winnerC = collected.first().content;
                    if(isNaN(winnerC)){
                        return message.reply(`You need to write an number!`);
                    }
                    if(winnerC > 99) return message.reply(`This cant me more then 100!`);
                    if(winnerC < 0) return message.reply(`This cant me more less then 1!`);

                    winnerCount = winnerC;
                    resolve()
                    collected.first().delete()

                }).catch(err => {
                    message.reply("Cancelled...").then(r => r.delete({timeout: 5000}));
                });
            })
        }

        function timeCheck(){
            return new Promise((resolve, reject) => {
                const filter = m => m.author.id === message.author.id;
                message.reply(`Step 3 Last step!. Write the time that this giveaway takes! (Time max is 1 month!) (This expires in 25 seconds! or write 'cancel' or 'abort' to stop!)`).then(r => r.delete({timeout: 25000}));
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 25000
                }).then(collected => {

                    if(collected.first().content === `cancel` || collected.first().content === `abort`){
                        return message.reply(`Your request got canceled!`);
                    }
                    collected.delete()
                    let toWinItem = collected.first().content;
                    if(isNaN(ms(toWinItem))) return message.reply(client.embederror(`ERROR! | Your date is not valid!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`));
                    if(toWinItem){
                        if(toWinItem<1)return message.channel.send(client.embederror(`ERROR! | Time is too small!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`));
                        if(toWinItem>3)return message.channel.send(client.embederror(`ERROR! | Time is too big!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`));
                        if(toWinItem.startsWith("-")) return message.channel.send(`The number can't start with '-' !`)
                        if(ms(toWinItem) > ms('31d')){
                            return message.channel.send(client.embederror(`ERROR! | 31 days (1 Month) Is the limit of the time!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`))
                        } else if(ms(toWinItem) < ms('1m')){
                            return message.channel.send(client.embederror(`ERROR! | Time cant be under 1 Min!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!`))
                        } else {
                            finished_time = ms(toWinItem);
                        }
                    } else {
                        return message.channel.send(client.embederror(`ERROR! | Time got errored, idk why but try it again!`, message.author.username, message.author.displayAvatarURL({dynamic: true}), `allowed is (1m, 2w, 5d, 1s or 5h, weeks = w, days = d, hours = h, seconds = s, minutes = m, month is undefined. use 31 days instead!\nYour time is "${toWinItem}" (If this field is empty. you didnt defined the time!)`));
                    }

                    resolve()
                    collected.first().delete()
                }).catch(err => {
                    message.reply("Cancelled...").then(r => r.delete({timeout: 5000}));
                });
            })
        }


        /*                                */
        /*        CHECK EVERYTHING!       */
        /*                                */

        /*                                */
        /*           TIMEOUT              */
        /*                                */
        const wait = ms => new Promise(result => {
            setTimeout(result, ms);
        });


        // WinnerCOunt
        //winnerCount = args[1];
        // getTime in seconds
        //time = args[2];
        // getItem
        //item = args.splice(2, args.length).join(' ');

        // Delete
        //message.delete();

        // timeOut
        function checkAll(){
            itemCheck()
                .then(() => {
                    return memberCheck()
                })
                .then(() => {
                    return timeCheck()
                })
                .then(() => {
                    return sendMSG()
                })
        }
        await checkAll()

        async function sendMSG(){
            return new Promise(async(resolve, reject) => {
                var date = new Date().getTime();
                var dateTime = dateFormat(new Date(date + (finished_time)), "dd, mm, yyyy | hh:mm:ss");

                var giveawayEmbed = new MessageEmbed()
                    .setTitle(`🎉 **${message.guild.name}'s Giveaway** 🎉`)
                    .setFooter(`Expire: ${dateTime} (GMT+0200 (Central European Summer Time)`, `${message.author.avatarURL()}`)
                    .setColor("RANDOM")
                    .setDescription(`To win: ${item}
    Giveaway from: ${ message.guild.members.cache.get(message.author.id).displayName}`);
                giveawayEmbed.setThumbnail(`https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.iconURL()}.png`);

                // React + Embed
                var embedSend = await message.channel.send(giveawayEmbed);
                embedSend.react("🎉");
                resolve()

                setTimeout(async function() {

                    // Arguments
                    var random = 0;
                    var winners = [];
                    var inList = false;

                    // How many people
                    var peopleReacted = embedSend.reactions.cache.get("🎉").users.cache.array();

                    // Remove bot as an Participater
                    for (var i = 0; i < peopleReacted.length; i++) {
                        if (peopleReacted[i].id == client.user.id) {
                            peopleReacted.splice(i, 1);
                            continue;
                        }
                    }

                    // if noone react
                    if (peopleReacted.length == 0) {
                        return message.channel.send("No one reacted. Giveaway Canceled").then(r => r.delete({timeout: 500}));
                    }

                    // if not enought member reacted
                    if (peopleReacted.length < winnerCount) {
                        return message.channel.send("There are too few people Participating so. Giveaway Canceled.").then(r => r.delete({timeout: 500}));
                    }

                    // idk xd
                    for (var i = 0; i < winnerCount; i++) {

                        inList = false;

                        // Select random
                        random = Math.floor(Math.random() * peopleReacted.length);

                        //
                        for (var y = 0; y < winners.length; y++) {
                            //
                            if (winners[y] == peopleReacted[random]) {
                                //
                                i--;
                                //
                                inList = true;
                                break;
                            }
                        }

                        //
                        if (!inList) {
                            winners.push(peopleReacted[random]);
                        }

                    }

                    // won msg
                    for (var i = 0; i < winners.length; i++) {
                        var giveawayEmbeddone = new MessageEmbed()
                            .setTitle(`🎉 **✅ Giveaway Done! ✅** 🎉`)
                            .setFooter(`Giveaway Done ✅`, `${message.author.displayAvatarURL()}`)
                            .setColor("RANDOM")
                            .setDescription(`Winners: ${winners[i]} \n Items won: ${item}`);
                        giveawayEmbeddone.setThumbnail(`https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.iconURL()}.png`);
                        await wait(500);
                        embedSend.edit(giveawayEmbeddone)
                        await wait(100);
                        message.channel.send(`Congratulations! ${winners[i]} ! You've won **${item}**.`);
                    }

                }, finished_time);

            })
        }
    }
}