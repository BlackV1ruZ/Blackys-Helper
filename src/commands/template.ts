import { CommandHandler } from "../utility/commandHandler";
import { Bot } from "../utility/bot";
import config from "config-yml";
import { CommandString } from "../utility/commandParser";

export default class TemplateCommand implements CommandHandler {
    run(command: CommandString, bot : Bot): void {
      command.originalMessage.channel.send("Template command, not implemented");
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