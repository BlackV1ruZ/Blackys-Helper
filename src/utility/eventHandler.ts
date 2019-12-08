import * as Discord from "discord.js";
import { Bot } from "./bot";
import { CommandString, CommandParsingErrors } from "./commandParser";
import * as config from "config-yml";

export default class EventHandler {
  constructor(
    private readonly bot: Bot
  ) {
    this.init();
  }

  init() {
    this.bot.client.on("message", (message: Discord.Message) => {
      let command: CommandString = this.bot.commandParser.parseMessage(message);
      if (command.err) {
        this.handleParsingErrors(command);
      } else {
        this.bot.runCommandString(command);
      }
    });
  }

  handleParsingErrors(command: CommandString) {
    switch (command.err) {
      case CommandParsingErrors["Command is configured to be ignored"]:
        // do nothing
        break;
      case CommandParsingErrors["Handler not registered"]:
        this.respondToUnregisteredHandle(command);
        break;
      case CommandParsingErrors["Message is DM"]:
        this.respondToDM(command);
        break;
      case CommandParsingErrors["Prefix not found"]:
        // do nothing
        break;
      case CommandParsingErrors["Author is bot"]:
        // do nothing
        break;
      case CommandParsingErrors["Handle is empty"]:
        this.respondToEmptyHandle(command);
        break;
      case CommandParsingErrors["not an active channel"]:
        // do nothing
        break;
    }
  }

  respondToUnregisteredHandle(command: CommandString) {
    command.originalMessage.channel.send(config.messages.unkown_command);
  }

  respondToDM(command: CommandString) {
    let channellist = "";
    this.bot.active_channels.forEach(t => {
      channellist += t.name + "\n";
    });
    command.originalMessage.channel.send(config.messages.dm_prefix + channellist);
  }

  respondToEmptyHandle(command: CommandString) {
    command.originalMessage.channel.send(config.messages.empty_handle);
  }
}