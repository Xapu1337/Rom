const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { MessageEmbed } = require("discord.js");

let parsed, uri;

const queue = new Map();

module.exports = {
    name: 'play',
    description: 'Joins and plays a video from youtube',
    aliases: [ 'p' ],
    async run(client, message, args,) {
        const serverQueue = queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('You need to be in a voice channel to use this command.');

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
            return message.reply("You don't have the correct permissions.");




        if (!args.length) return message.reply('You need to specify what song you want to play.');
        let song = {};

        if (ytdl.validateURL(args[0])) {
            const songInfo = await ytdl.getInfo(args[0]);
            song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
        }
        else {
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
            };
            const video = await videoFinder(args.join(''));

            if (video) {
                song = { title: video.title, url: video.url };
            } else {
                message.reply('Error finding song.');
            }
        }

        if (!serverQueue) {
            const queueConstructor = {
                voiceChannel: voiceChannel,
                textChannel: message.channel,
                connection: null,
                songs: []
            };

            queue.set(message.guild.id, queueConstructor);
            queueConstructor.songs.push(song);
            const videoPlayer = async (guild, song) => {
                const songQueue = queue.get(guild.id);

                if (!song) {
                    songQueue.voiceChannel.leave();
                    queue.delete(guild.id);
                }

                const stream = ytdl(song.url, { filter: 'audioonly' });
                songQueue.connection.play(stream, { seek: 0, volume: 5 }).on('finish', () => {
                    songQueue.songs.shift();
                    videoPlayer(guild, songQueue.songs[0]);
                });
                await songQueue.textChannel.send(`Now playing: **${song.title}**`);
            };

            try {
                queueConstructor.connection = await voiceChannel.join();
                await videoPlayer(message.guild, queueConstructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.reply('There was an error connecting.');
                throw err;
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** has been added to the queue.`);
        }


    }
};