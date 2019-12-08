import { Message } from "discord.js";
import * as config from "config-yml";
import { Bot } from "./bot";
import { CommandHandler } from "./commandHandler";

export default class CommandParser {
  private bot: Bot;
  constructor(bot: Bot) {
    this.bot = bot;
  }

  parseMessage(message: Message): CommandString {
    let response: CommandString = null;
    response = this.checkSimpleAssertions(message);
    if (response) return response;

    let messageWithoutPrefix = message.content.substring(config.prefix.length);
    let messageParts = messageWithoutPrefix.split(new RegExp("\\s+"));
    response = new CommandString(message);
    response.handle = messageParts.shift();

    if ((<Array<string>>config.ignoredCommands).includes(response.handle)) {
      response.err = CommandParsingErrors["Command is configured to be ignored"];
      return response;
    }

    if (this.bot.commands.has(response.handle)) {
      response.commandHander = this.bot.commands.get(response.handle);
      response.args = messageParts;
      return response;
    } else {
      response.err = CommandParsingErrors["Handler not registered"];
      return response;
    }
  }

  private assertMessage(message: Message, condition: Boolean, commandParsingErrors: CommandParsingErrors): CommandString {
    if (condition) {
      return new CommandString(message,
        null, null, null,
        commandParsingErrors);
    } else {
      return null;
    }
  }

  private simpleAssertions = [
    (message: Message): CommandString => { return this.assertMessage(message, message.author.bot, CommandParsingErrors["Author is bot"]) },
    (message: Message): CommandString => { return this.assertMessage(message, !(<Array<string>>config.discord.channel_ids).includes(message.channel.id), CommandParsingErrors["not an active channel"]) },
    (message: Message): CommandString => { return this.assertMessage(message, !message.content.startsWith(config.prefix), CommandParsingErrors["Prefix not found"]) },
    (message: Message): CommandString => { return this.assertMessage(message, message.channel.type === "dm", CommandParsingErrors["Message is DM"]) },
    (message: Message): CommandString => { return this.assertMessage(message, message.content.length == config.prefix.length, CommandParsingErrors["Handle is empty"]) }
  ]

  private checkSimpleAssertions(message: Message): CommandString {
    let response: CommandString = null;
    this.simpleAssertions.some((func) => {
      response = func(message);
      if (response) {
        return true;
      } else {
        return false;
      }
    });
    return response;
  }
}

export class CommandString {
  constructor(
    public readonly originalMessage: Message,
    public handle?: string,
    public args?: string[],
    public commandHander?: CommandHandler,
    public err?: CommandParsingErrors
  ) { }
}
export const enum CommandParsingErrors {
  "None",
  "Prefix not found",
  "Author is bot",
  "Message is DM",
  "Handler not registered",
  "Command is configured to be ignored",
  "Handle is empty",
  "not an active channel"
}