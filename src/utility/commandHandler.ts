import { Bot } from "./bot";
import { CommandString } from "./commandParser";
export interface CommandHandler {
  run(command : CommandString, bot: Bot): void;
  meta: {
    id: string;
    command: [{
      name: string;
      handles: string[];
      description: string;
      usage: string;
      permissions: string[];
    }];
  };
}
