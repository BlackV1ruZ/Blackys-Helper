import { CommandHandler } from "../utility/commandHandler";
import { Bot } from "../utility/bot";
import config from "config-yml";
import { CommandString, CommandParsingErrors } from "../utility/commandParser";
import { RichEmbed, ColorResolvable } from "discord.js";

import * as colors from "../resources/colors.json";

export default class HelpCommand implements CommandHandler {
  run(command: CommandString, bot: Bot): void {
    if (!command.args || command.args.length == 0) {
      this.respondAllCommands(command, bot);
    } else {
      throw Error("Not implemented");
    }
  }

  respondAllCommands(command: CommandString, bot: Bot) {
    let commands = this.getAllCommands(this.getUniqueMetas(bot));
    let helpEmbed = new RichEmbed();
    helpEmbed
      .setThumbnail(bot.client.user.avatarURL)
      .setTitle("You require Help?")
      .setColor(colors.cyan);
    commands.forEach((command) => {
      helpEmbed.addField(`${config.prefix}${command.handles[0]} - ${command.name}`,command.description);
    })
    command.originalMessage.channel.send(helpEmbed);
  }

  private getUniqueMetas(bot: Bot) : CommandHandler["meta"][] {
    let flatMetas: CommandHandler["meta"][] = bot.commands.map(v => {
      return v.meta;
    });
    flatMetas = flatMetas.sort((a, b) => {
      if (a.id === b.id)
        return 0;
      if (a.id > b.id)
        return 1;
      if (a.id < b.id)
        return -1;
    });
    flatMetas = flatMetas.filter((meta, i, array) => {
      if (i == 0)
        return meta;
      if (meta.id != array[i - 1].id)
        return meta;
    });
    return flatMetas;
  }

  private getAllCommands(metas: CommandHandler["meta"][]) : CommandHandler["meta"]["command"][0][]{
    let commands : CommandHandler["meta"]["command"][0][] = new Array<CommandHandler["meta"]["command"][0]>();
    metas.forEach((meta) => {
      meta.command.forEach((command) => {
        commands.push(command);
      })
    })
    return commands;
  }

  meta: CommandHandler["meta"] = {
    id: "help",
    command: [
      {
        name: "Help me help you!",
        handles: [
          "help",
          "h"
        ],
        description: "Did you ever have a dream?",
        usage: `${config.prefix}help for all commands\n${config.prefix}help <command> for details about one command`,
        permissions: [
        ]
      }
    ]
  };
}