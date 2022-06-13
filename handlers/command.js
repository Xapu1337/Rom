const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status").setBorder("└─","─", "┌", "┘");

/*
As of.
 */

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                if(client.categories.includes(pull.category)){
                client.commands.set(pull.name, pull);
                table.addRow(`${"File:".bgBlack.green} ${file} ${"[".cyan.bgBlack+"Command:".bgBlack} ${pull.name.bgBlack.green}${"]".bgBlack.cyan}`, `${"Was loaded Successfully.".bgBlack.green}`);
                } else {
                    table.addRow(file.red, `${"Category '%c%' doesn't exist.".replace("%c%", pull.category).red}`);
                }
            } else {
                table.addRow(file.red, `${"missing a help.name, or help.name is not a string!".red}`);
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    console.log(table.toString());
}

/**
 * This is the basic command layout
 * Extra: note: ""
 module.exports = {
name: "Command name",
aliases: ["array", "of", "aliases"],
category: "Category name",
description: "Command description",
usage: "[args input]",
hidden: false,
permissions: "EVERYONE",
run: (client, message, args) => {

  }
 }
 */