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
    if(message.author.id === (await client.botAuthor).id){
        if(!args[0]) return message.channel.send(`Please, Enter the command name.`);

        let commandName = args[0].toLowerCase();
        // works: __dirname +"/../../commands"
        try{
            readdirSync("./commands/").forEach(dir => {
                const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
                for (let file of commands) {
                    delete require.cache[require.resolve(`../../commands/${dir}/${file}`)]
                    let pull = require(`../../commands/${dir}/${file}`);
                    if (pull.name && pull.name===commandName) {
                        if(client.categories.includes(pull.category)){
                            client.commands.delete(pull.name);
                            client.commands.set(pull.name, pull);
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
            client.utils.logError(message, client, e);
            return message.channel.send(`Could not reload: ${args[0].toUpperCase()}, Error was logged onto the Console!`);
        }

        message.channel.send(`Module ${args[0].toUpperCase()} Reloaded!`);
        client.utils.logError(message, client, "Welcome to the Cumzone.");
    }
  }
 }