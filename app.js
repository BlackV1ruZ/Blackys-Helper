const { bot } = require("./utility/bot");

const Discord = require('discord.js');
const config = require('config-yml');
const util = require ('util');
const fs = require("fs");

function init(){
  loadCommands();
}

function loadCommands(){
  bot.commands=new Discord.Collection();
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    else {
      if (files <= 0) {console.info("No files in ./commands/");} 
      else {
        let commandFiles=files.filter((file) => file.split('.').pop().match("(js|ts)"));
        if (commandFiles <= 0) {console.info("No javascript or typescript files found in ./commands/");} 
        else {
          loadCommandFiles(commandFiles);
        }
      }
      if (bot.commands.size <= 0) {console.info("No commands loaded");}
    }
  });

  function loadCommandFiles(files) {
    files.forEach((commandFile) => {
      let command = require(`./commands/${commandFile}`);
      registerCommandHandles(command);
    });
  }

  function registerCommandHandles(command) {
    command.meta.forEach((meta) =>{
      registerCommandMetaHandles(meta, command);
    });
  }

  function registerCommandMetaHandles(meta, command) {
    meta.handles.forEach((handle) => {
      if (handleIsRegistered(handle)) {
        console.error(`Duplicate handle: ${handle} exists in ${command.meta.id} `
          + `and ${bot.commands.get(handle).meta.id}. `
          + `Handle claim for ${command.meta.id} is discarded.`);
      }
      else {
        bot.commands.set(handle, command);
      }
    });
  }
}

function handleIsRegistered(handle){
  return bot.commands.has(handle);
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

function respondToDM(message){
  channellist ="";
  bot.active_channels.forEach(t=> {
    channellist+=t.name+"\n";
  });
  message.channel.send(config.messages.dm_prefix + channellist);
}

bot.on("ready", init);

bot.on("message", async message =>{
  if (message.author.bot) return;
  else if (message.channel.type === "dm") {respondToDM(message);}
  else if (isCommand(message)) {respondToCommand(message);}
})

console.debug("config:");
console.debug(util.inspect(config, false, null, true /* enable colors */));
bot.login(config.discord.bot_token);
