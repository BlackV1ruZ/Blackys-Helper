const Discord = require('discord.js');
const config = require('config-yml');
const util = require ('util');

const bot = new Discord.Client({disableEveryone: true});

var channels=[]

function mapChannels(){
  channels=config.discord.channel_ids.map(t => {
    var test=bot.channels.get(t);
    return {id: t, name: bot.channels.get(t).name};
  })
}

function respondToDM(message){
  channellist ="";
  channels.forEach(t=> {
    channellist+=t.name+"\n";
  });
  message.channel.send("I only respond in public channels :/ but thanks for the attempt to flirt\n"
    + "To see the available commands write !help in one of the following channels:\n" 
    + channellist);
}

function isCommand(message){
  return config.discord.channel_ids.includes(message.channel.id) 
      && message.content.startsWith(config.prefix);
}

function respondToCommand(message){
  message.channel.send("Soon...");
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and kicking!`);
  bot.user.setActivity("with itself", {type: "PLAYING"});
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
