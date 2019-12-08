const Discord = require("discord.js");
const config = require("config-yml");
const bot = new Discord.Client({ disableEveryone: true });

function mapChannels(){
  bot.active_channels=config.discord.channel_ids.map(t => {
    return {id: t, name: bot.channels.get(t).name};
  })
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and kicking!`);
  bot.user.setActivity(config.messages.activity.message, 
    {type: config.messages.activity.type});
  mapChannels();
});

bot.on("channelUpdate", mapChannels);
bot.on("channelCreate", mapChannels);
bot.on("channelDelete", mapChannels);
bot.on("resume", mapChannels);

exports.bot = bot;
