const Discord=require ("discord.js");
const config=("config-yml");

module.exports.run=async (bot, message, command, args) => {
    message.channel.send("Template command, not implemented");
    
}

module.exports.meta=[
    {
        id: "template",
        name: "Nice Template",
        handles: ["template", "temp"],
        description: "This is a template command",
        usage: `${config.prefix}template should be enough information`,
        permissions: [
            "template",
            "template.demo",
            "template.admin"
        ]
    },
    {
        id: "template2",
        name: "Nice Template2",
        handles: ["template2", "temp2"],
        description: "This is a template command2",
        usage: `${config.prefix}template2 one might think one template is enough`,
        permissions: [
            "template2",
            "template2.demo",
            "template2.admin"
        ]
    }
]