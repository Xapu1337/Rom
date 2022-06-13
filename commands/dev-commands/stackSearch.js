const axios = require("axios");
const { MessageEmbed } = require('discord.js')
let _ = require('lodash');
let StackExchange = require("../../utils/stackexchange/index");
const assert = require("assert")
let htmlentities = require('html-entities');
module.exports = {
    name: "stackoverflow",
    aliases: ["sof", "sofSearch"],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "sof <args>",
    permissions: "VERIFIED",
    run: async(client, message, args) => {

        let contentSettings = {
                version: 2.2
            },
            SPINNER_OPTIONS = {
                doNotBlock: true
            };

        const context = new StackExchange(contentSettings);

        async function fetchQuestionAnswers(parsedLink) {
            assert(parsedLink);
            let questionCriteria = {
                filter: '!-*f(6s6U8Q9b'
            };
            questionCriteria.site = parsedLink.site;

            try {
                let results = await context.questions.answers(questionCriteria, parsedLink.questionId);
                return _.sortBy(results.items, (answer) => -answer.score);
            } catch (err) {
                console.error(err);
            }
        }

        function parseStackoverflowQuestionId(link) {
            let re,
                matches;
            if(link && link.indexOf('stackoverflow.com') !== -1) {
                re = /.*stackoverflow.com\/questions\/(\d+)\//;
                matches = re.exec(link);
                if(!matches || matches.length < 2) return null;
                if(matches) {
                    return {
                        site: 'stackoverflow',
                        questionId: matches[1]
                    };
                }
            }
            else if(link && link.indexOf('stackexchange.com') !== -1) {
                re = /.*\/\/(.*).stackexchange.com\/questions\/(\d+)\//;
                matches = re.exec(link);
                if(!matches || matches.length < 3) return null;
                return {
                    site: matches[1],
                    questionId: matches[2]
                };
            }
            else return null;
        }

        async function stackOverflowSearch(query) {
            let req = await axios.get(`https://api.stackexchange.com//2.2/search/advanced?order=desc&sort=relevance&q=${encodeURI(query)}&site=stackoverflow`);
            return req.data.items[0];
        }
        let searchResult = await stackOverflowSearch(args.join(" "));
        if(!searchResult)
            return message.reply("Sorry, Nothing found.");
        const parsedLink = await parseStackoverflowQuestionId(searchResult.link);
        let resArr = await fetchQuestionAnswers(parsedLink);
        let { body_markdown, owner, is_accepted, score, link} = resArr[0];
        try {
            let embed = new MessageEmbed()
                .setAuthor(`STACKOVERFLOW SEARCH`)
                .setTitle(searchResult.title)
                .setColor('RANDOM')
                .addField(':inbox_tray: Input', `\`\`\`js\n${args.join(' ')}\`\`\``)
                .addField('🔍 RESULT:', `\n${htmlentities.decode(body_markdown, {level: "all"})}\n`)
                .setFooter(`Answer from: ${owner.display_name}, Accepted: ${is_accepted ? "Yes" : "No"}, Score: ${score}`)
                .setURL(link);
            await message.channel.send(await embed);
        } catch (e) {
            await message.channel.send(`\`\`\`js\n${await e}\n\`\`\``);
        }

    }
}
