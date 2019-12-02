const Discord = require('discord.js');
const config = require('config-yml');
const util = require ('util');

const bot = new Discord.Client({disableEveryone: true});

var channels=[]

function mapChannels(){
  channels=config.discord.channel_ids.map(t => {
    return {id: t, name: bot.channels.get(t).name};
  })
}

function respondToDM(message){
  channellist ="";
  channels.forEach(t=> {
    channellist+=t.name+"\n";
  });
  message.channel.send(config.messages.dm_prefix + channellist);
}

function isCommand(message){
  return config.discord.channel_ids.includes(message.channel.id) 
      && message.content.startsWith(config.prefix)
      && !config.ignoredCommands.includes(message.content.substring(config.prefix.length));
      
}

function respondToCommand(message){
  message.channel.send(config.messages.unkown_command);
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and kicking!`);
  bot.user.setActivity(config.messages.activity.message, 
    {type: config.messages.activity.type});
  mapChannels();
});

bot.on("channelUpdate", (channel) =>{
  mapChannels();
})

bot.on("message", async message =>{
  if(message.author.bot) return;
  else if(message.channel.type === "dm") {respondToDM(message);}
  else if (isCommand(message)) {respondToCommand(message);}
})

console.debug("config:");
console.debug(util.inspect(config, false, null, true /* enable colors */));
bot.login(config.discord.bot_token);
