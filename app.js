const Discord = require('discord.js');
const config = require('config-yml');
const util = require ('util');
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});

var channels=[];

function mapChannels(){
  channels=config.discord.channel_ids.map(t => {
    return {id: t, name: bot.channels.get(t).name};
  })
}

function init(){
  mapChannels();
  loadCommands();
}

function loadCommands(){
  bot.commands=new Discord.Collection();
  fs.readdir("./commands/", (err, files) => {
    if (err)
      console.error(err);
    else {
      let commandFiles=files.filter((file) => file.split('.').pop() === "js");
      if (files <= 0) {
        console.info("No commands found in ./commands/");
      } else {
        loadCommandFiles(commandFiles);
      }
    }
  });

  function loadCommandFiles(files) {
    files.forEach((commandFile) => {
      let command = require(`./commands/${commandFile}`);
      registerCommandHandles(command);
    });
  }

  function registerCommandHandles(command) {
    command.meta.handles.forEach((handle) => {
      if (handleIsRegistered(handle)) {
        console.error(`Duplicate handle: ${handle} exists in ${command.meta.id} and ${bot.commands.get(handle).meta.id}. Handle claim for ${command.meta.id} is discarded.`);
      }
      bot.commands.set(handle, command);
    });
  }
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
  let handle=message.content.substring(config.prefix.length)
    .split(new RegExp("\\s"))[0];
  if(!handleIsRegistered(handle))message.channel.send(config.messages.unkown_command);
  else bot.commands.get(handle).run(bot, message, handle);
}

function handleIsRegistered(handle){
  return bot.commands.keyArray().find(h => h === handle);
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and kicking!`);
  bot.user.setActivity(config.messages.activity.message, 
    {type: config.messages.activity.type});
  init();
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
