module.exports = {
    name: "reload",
    aliases: [],
    category: "dev-commands",
    description: "DEV TEST",
    usage: "",
    hidden: true,
    permissions: "AUTHOR",
    run: (client, message, args) => {
    if(message.author.id === client.botauthorid){
        //Double check.
        if(!args[0]) return message.channel.send(`Bitte, gebe die Argumente ein für den reload!`);

        let commandName = args[0].toLowerCase();

        try{
            delete require.cache[require.resolve(`./${commandName}.js`)]
            client.commands.delete(commandName);
            const pull = require(`./${commandName}.js`);
            client.commands.set(commandName, pull);
        } catch(e){
            console.log(e);
            return message.channel.send(`Könnte nicht neuladen: ${args[0].toUpperCase()}, Fehler in der console geloggt!`);
        }

        message.channel.send(`Modul ${args[0].toUpperCase()} Neugeladen!`)
    }
  }
 }