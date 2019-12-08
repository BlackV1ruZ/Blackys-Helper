import { Bot, channelMapping } from "./utility/bot";
import * as Discord from "discord.js" ;
import * as config from "config-yml";
import * as util from "util";

const bot = new Bot();

function isCommand(message){
  return config.discord.channel_ids.includes(message.channel.id) 
    && message.content.startsWith(config.prefix)
    && !config.ignoredCommands.includes(message.content.substring(config.prefix.length));
}

function respondToCommand(message){
  let handle=message.content.substring(config.prefix.length)
    .split(new RegExp("\\s"))[0];
  if(!bot.handleIsRegistered(handle)) message.channel.send(config.messages.unkown_command);
  else bot.commands.get(handle).run(bot, message, handle);
}

function respondToDM(message){
  let channellist ="";
  bot.active_channels.forEach(t=> {
    channellist+=t.name+"\n";
  });
  message.channel.send(config.messages.dm_prefix + channellist);
}

bot.client.on("message", async message =>{
  if (message.author.bot) return;
  else if (message.channel.type === "dm") {respondToDM(message);}
  else if (isCommand(message)) {respondToCommand(message);}
})

console.debug("config:");
console.debug(util.inspect(config, false, null, true /* enable colors */));
bot.login();
