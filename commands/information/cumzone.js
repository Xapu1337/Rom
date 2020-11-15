module.exports = {
    name: "yes",
    aliases: ["array", "of", "aliases"],
    category: "welcome to the cumzone.",
    description: "Command description",
    usage: "[args input]",
    hidden: false,
    permissions: "EVERYONE",
    run: (client, message, args) => {
        message.reply("welcome to the cumzone.");
    }
}