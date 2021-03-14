
const guildSchema = require("../utils/GuildSchema")
const {Message, MessageEmbed, User, GuildMember, Client, Snowflake} = require("discord.js");
const VerifiedModel = require("../utils/VerifiedSchema");
const getColors = require('get-image-colors');
const nano  = require("nanoid");
const fetch = require("node-fetch");
module.exports = {

    /**
     * The actual getMember function where it searched everything.
     * @param {Message} message - Message to get information from.
     * @param {String} toFind - Anything, ID, Username or Mention
     * @returns {GuildMember | string} - Member or error containing that no member was found.
     */
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();
        let target = message.guild.members.fetch(toFind);
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.fetch().forEach(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if (!target)
            target = "NOT_FOUND";

        return target;
    },

    /**
     *
     * @param {String} title - Information what went wrong.
     * @param {Message} message - Message to get information from.
     * @returns {module:"discord.js".MessageEmbed} Embed
     */
    errorEmbed: function (title, message){
        return new MessageEmbed()
            .setTitle("Error while executing.")
            .addField("\u200B", message, true)
            .setColor("DARK_RED")
            .setThumbnail("https://cdn.discordapp.com/attachments/673161310145609750/777529948956524544/668146823231307776.png");
    },

    /**
     *
     * @param {Message} message - Message to get information from.
     * @returns {module:"discord.js".MessageEmbed} Embed
     */
    successEmbed: function (message){
        return new MessageEmbed()
            .setTitle("Successfully executed.")
            .addField("\u200B", message, true)
            .setColor("GREEN")
            .setThumbnail("https://cdn.discordapp.com/attachments/673161310145609750/777530510817361920/761174767016476692.gif");
    },

    /**
     * Simple formation from a date object to string.
     * @param {Date} date - Date to format
     * @returns {string} - Date as string from the date.
     */
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    /**
     * Gets the current queue from the guild.
     * @param {Message} message - Message to get information from.
     * @param {Client} client - Client objet.
     * @returns {Promise<module:"discord.js".MessageEmbed>} - Embed of the queue.
     */
    getQueueEmbed: async (message, client) => {
        let queue = await client.player.getQueue(message);
        let ql = (queue.tracks.map((song, i) => {
            return `${i === 0 ? 'Now Playing' : `\`#${i+1}\``} - \`${song.title}\`${song.author ?  ` | \`${song.author}\`` : ""} (${song.duration})`
        })).join("\n");
        let embed = new MessageEmbed()
            .setColor(await client.utilFeatures.getColorFromUserId(message.member, client))
            .setFooter(`A request from: ${message.author.username}`)
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setDescription(ql.length >= 2048 ? "Splitting into fields..." : ql);
        if(ql.length >= 2048){
            let qql = ql.convertStringToArray(1024);
            qql.forEach(i => {
                embed.addField(client.charList.EMPTY, i);
            });
        }
        return embed;
    },

    /**
     * Allow or add people to the trusted DB
     * @param id UserID Resolved in an string
     * @param add should it add to the DB?
     * @returns {Promise<Boolean>}
     */
    verifyUser: async function(id, add){
        let user = await VerifiedModel.findOne({ID: id});
        if(!user && add)
            await VerifiedModel.create({ID: id, trusted: true})
        return user !== null ? user.trusted : false;
    },

    /**
     * Get a member from a nickname id or mention. (FUCK YEAH PREMIUM!)
     * @param {CLient} client - Client object.
     * @param {Message} message - Message object to get information from.
     * @param {String[]} args - String array of the args
     * @param {Number} argsIndex - From where to pick the message to check in the args.
     * @returns {Promise<*>} - The user OR an error.
     */
    extendedMemberSearch: async function (client, message, args, argsIndex){
        let user = await client.utilFeatures.getMember(message, args[argsIndex])
        if (user === "NOT_FOUND") {
            message.reply("This user was not found.");
        } else {
            return user;
        }
    },

    /**
     * Return hex from the users profile picture.
     * @param {User} user - User to get the profile color from.
     * @param {Client} client - Client object.
     * @returns {Promise<string|*>} - Hex from the user if something is wrong it returns a white grey color.
     */
    getColorFromUserId: async function (user, client){
        if(!user || user.isPrototypeOf(Message) || user.content)
            return;
        //let userHex = (await Vibrant.from((await client.users.fetch(user.id)).displayAvatarURL({format: "png"})).getPalette()).Vibrant.hex
        if(user) {
            let userHex;
            await getColors((await client.users.fetch(user.id)).displayAvatarURL({format: "png"})).then(value => {
                userHex = value[Math.randomBetween(0, value.length - 1)]._rgb;
            });
            if (userHex === null || userHex === undefined) {
                return "#f0f0f0";
            }
            return userHex
        }

    },

    /**
     * Get the guild database from the given id.
     * @param {Snowflake} gID - Guild id from where to get the document to.
     * @returns {Promise<*|Document<any, {}>>} - The returned document.
     */
    getGuildDB: async function (gID){
        let guildDB = await guildSchema.findOne( { id: gID } );

        if(guildDB){
            return guildDB;
        } else {
            guildDB = new guildSchema({
                id: gID
            });
            await guildDB.save().catch(err => console.log(err));
            return guildDB;
        }
    },

    /**
     * DM Me on discord & telegram with a message and information so i know what went wrong.
     * @param {Client} client - Client object.
     * @param {Message} message - Message to get information from.
     * @param {String} errorMsg - Error message where it went wrong
     * @param {Object} ExtraError - Failstack, Errorstack anything at this point.
     * @returns {Promise<void>}
     */
    logError: async function(client, message, errorMsg, ...ExtraError)
    {
        let errorMsgToSend = `
            Got an error. 
            Guild infos: {
                Guild id: ${message ? message.guild : "Message empty. got an non command or message error."}
                Guild Name: ${message ? message.guild.name : "Message empty. got an non command or message error."}
            }
            Message: ${message ? message.content : "Message empty. got an non command or message error."}
            Error: {
                Error Message: ${errorMsg}
                More Details:
                 ${ExtraError ? ExtraError : "None."}
            }`;

        console.log(errorMsg);
        try{
            await fetch(`https://api.telegram.org/bot1486860047:AAGoSiBYuQc1nQ0fb-mryWakCMlBREN-30U/sendMessage?chat_id=1492002913&text=${errorMsgToSend}`);
        } catch (e) {
            return;
        }
        await client.botAuthor.send(new MessageEmbed()
            .setColor("DARK_RED")
            .setDescription(errorMsgToSend));
//        .setThumbnail( message.guild.iconURL).then(m => m.delete({timeout: 2500}));
    },

    /**
     * Add a warn for an user from a guild.
     * @param {Client} client - Client object.
     * @param {Message} message - Message to get information from.
     * @param {User} user - User to add it to.
     * @param {String} reason - Reason why the warn was added.
     * @returns {Promise<void>}
     */
    addWarning: async function (client, message, user, reason){
        reason = reason.length > 0 ? reason : "None.";
        // if the reason was not included. use "none" else its shit.
        const id = nano.customAlphabet(message.id + message.guild.id + await user.id + "WARNINGSYSTEM" +  await user.username + message.author.name + message.author.discriminator, 21);
        // Cursed way of getting an id. this is actually shit but i don't care and it is kinda unique... i guess.
        const req = await client.getGuildDB(message.guild.id);
        // GET THAT FUCKING MONGODB
        req.warnings.push({reason: reason, userID: await user.id, warnID: id().toString(), creatorID: message.author.id, creationTime: Date.now()});
        // CUKA PUSHING THE ARRAY HARDER THEN THE T-28 THE .308 ANTI TANK ARMOR BULLETS
        await req.save();
        // What my parents should do before i were born, make an save game.
        await message.channel.send(new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Success! ✅")
            .setDescription(`Created a warning with the id: \`${id()}\` and the reason: \`${reason}\` for the user: ${await user.user}`)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        );
        // Send embed that is... s t y l i s h ?.
    },

    /**
     * delete the warn of the guild.
     * @param {Client} client - Client object.
     * @param {Message} message - Message to get information from.
     * @param {String} id - The warn id.
     * @returns {Promise<void>}
     */
    deleteWarning: async function (client, message, id){
        const req = await client.utilFeatures.getGuildDB(message.guild.id);
        let filteredWarn = req.warnings.filter(i => i.warnID === id);
        message.reply(filteredWarn);
        if(!filteredWarn.id) {
            message.reply(`The warn with the id: \`${id}\` doesn't exist.`);
            return;
        }
        req.warnings = req.warnings.filter(i => i.warnID !== id);
        await req.save();
        await message.channel.send(new MessageEmbed()
            .setColor("RED")
            .setTitle("Success! ✅")
            .setDescription(`Removed the Warning with the id: ${id}. (Warn Reason: ${await req.warnings.filter(i => i.warnID === id).reason})`)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        ).then(m => m.delete({timeout: 6500}));
    },

    /**
     * @deprecated also no need since rom will make an balance command sometimes later
     * use mathematical operators with an number to add remove or do anything with it
     * @param {Client} client - client object.
     * @param {Snowflake} guildID - the guild where the user is inside.
     * @param {Snowflake} userID - what user to add it.
     * @param {Number | String} amount - the amount of the money that will be processed.
     * @param {String} operator - what mathematical operator should be used.
     * @returns {Promise<void>}
     */
    ecoMathAcc: async function (client, guildID, userID, amount, operator){
        let req = await client.utilFeatures.getGuildDB(guildID);
        amount = Number(amount); // else its a string.
        if(!req || !userID)
            return;

        let userAcc = await req.eco.filter(value => value.userID === userID);
        if (!userAcc || userAcc === [] || userAcc.length < 0 || !userAcc[0]) {
            req.eco.push({userID, money: 0});
            req.save();
        }

        switch(operator){
            case "+":
                userAcc[0].money += amount;
                break;
            case "-":
                userAcc[0].money -= amount;
                break;
            case "/":
                userAcc[0].money /= amount;
                break;
            case "*":
                userAcc[0].money *= amount;
                break;
            case "^":
                userAcc[0].money ^= amount;
                break;
            case "=":
                userAcc[0].money = amount;
                break;
            case "%":
                userAcc[0].money %= amount;
                break;
            default:
                console.log("Fucker forget the operator in the eco math function.");
                break;
        }
        // console.log(req.eco);
        // console.log(userAcc.money);
        // guildSchema.updateOne({'eco.userId': 2}, {'$set': {
        //         'eco.$.money': userAcc.money,
        //     }
        // });
        // console.log(req.eco);
        await req.save();
    },

    /**
     * @deprecated useless.
     * Get the balance from an user from a guild.
     * @param {Client} client - client object, Any more explanations?
     * @param {Snowflake} guildID - guild id form where to filter, No global nonono.
     * @param {Snowflake} userID - from what user to get the balance to.
     * @returns {Promise<{money: {default: number, type: Number | NumberConstructor}, userID: {type: String | StringConstructor}}[]|number>} - returns the money and the user id (ARRAY NEEDS TO BE USED WITH MONEY[0])
     */
    getEcoAcc: async function (client, guildID, userID){
        let req = await client.utilFeatures.getGuildDB(guildID);
        let userEco = await req.eco.filter(value => value.userID === userID);
        if(!req || !userID){
            return;
        }
        if (!userEco || userEco === [] || userEco.length < 0 || !userEco[0]) {
            let b = req.eco.push({userID, money: 0});
            await req.save();
            return b;
        } else {
            return req.eco.filter(value => value.userID === userID);
        }
    },

    /**
     *
     * @param {Message} message - the message to follow before the collector starts.
     * @param {User} author - message.author to verify no one else reacts.
     * @param {Number} time - in seconds, How long until the collector will stop.
     * @param {Array} validReactions - an array or just 1 emoji or name. (\<:daniSquare:768073667804266516>)
     * @returns {Promise<Collection<Snowflake, MessageReaction>>} - the emoji & the emoji name.
     */
    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }
};