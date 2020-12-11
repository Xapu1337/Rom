module.exports = {
    name: "awaittest",
    aliases: [],
    category: "dev-commands",
    description: "DEV TEST",
    usage: "",
    permissions: "AUTHOR",
    run: (client, message, args) => {
    const filter = m => m.author.id === message.author.id;
    message.reply(`Now write an message, 10 seconds until this expire!`).then(r => r.delete({timeout: 10000}));
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000
    }).then(collected => {
        console.log(collected)
    }).catch(err =>{
        console.log(err);
    });
  }
 }