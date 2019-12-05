const Discord=require ("discord.js");
const Config=("config-yml");

module.exports.run=async (bot, message, command, args) => {
    message.channel.send("Template command, not implemented");
}

module.exports.meta={
    id: "template",
    name: "Nice Template",
    handles: ["template", "temp"],
    description: "This is a template command",
    usage: `${Config.Prefix}template should be enough information`,
    additionalPermissions: [
        "template.demo",
        "template.admin"
    ]
}