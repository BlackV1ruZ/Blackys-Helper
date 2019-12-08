import { Bot } from "./bot";
import { Message } from 'discord.js';
export interface CommandHandler {
  run(bot: Bot, message: Message, command: string, args?: string[]): void;
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
