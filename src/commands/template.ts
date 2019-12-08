import { CommandHandler } from "../utility/commandHandler";
import { Message } from "discord.js";
import { Bot } from "../utility/bot";
import config from "config-yml";

export default class TemplateCommand implements CommandHandler {
    run(bot: Bot, message: Message, command: string, args?: string[]): void {
      message.channel.send("Template command, not implemented");
    }
    meta: CommandHandler["meta"]= {
        id: "template.typescript",
        command: [
          { 
            name: "Awesome typescript command template",
            handles: [
              "type",
              "typescript"
            ],
            description: "r/woosh",
            usage: `${config.prefix}typescript should suffice`,
            permissions: [
              "template.typescript",
              "template.typescript.admin"
            ]
          }
        ]
    };
}