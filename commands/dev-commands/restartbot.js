const { readdirSync } = require("fs");

module.exports = {
    name: "reload",
    aliases: [],
    category: "dev-commands",
    description: "DEV TEST",
    usage: "",
    hidden: true,
    permissions: "AUTHOR",
    run: async (client, message, args) => {
        console.log("checking pre botauthor "+(await client.botAuthor).tag)
        console.log(message.author.id)
        console.log((await client.botAuthor).id)
    if(message.author.id === (await client.botAuthor).id){
        console.log("is author")
        if(!args[0]) return message.channel.send(`Bitte, gebe die Argumente ein für den reload!`);

        let commandName = args[0].toLowerCase();
        // works: __dirname +"/../../commands"
        try{
            readdirSync("./commands/").forEach(dir => {
                const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
                for (let file of commands) {
                    delete require.cache[require.resolve(`../../commands/${dir}/${file}`)]
                    let pull = require(`../../commands/${dir}/${file}`);;
                    if (pull.name && pull.name===commandName) {
                        if(client.categories.includes(pull.category)){
                            client.commands.delete(pull.name);
                            client.commands.set(pull.name, pull);
                            console.log(pull)
                            console.log(pull.run.toString())
                            console.log(`${"File:".bgBlack.green} ${file} ${"[".cyan.bgBlack+"Command:".bgBlack} ${pull.name.bgBlack.green}${"]".bgBlack.cyan} ${"Was loaded Successfully.".bgBlack.green}`);
                        } else {
                            console.log(`${file.red} ${"Category '%c%' doesn't exist.".replace("%c%", pull.category).red}`);
                        }
                    } else {
                        continue;
                    }
                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.delete(alias));
                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
                }
            });
        } catch(e){
            console.log(e);
            return message.channel.send(`Könnte nicht neuladen: ${args[0].toUpperCase()}, Fehler in der console geloggt!`);
        }

        message.channel.send(`Modul ${args[0].toUpperCase()} Neugeladen!`)
    }
  }
 }