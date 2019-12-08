import { Bot } from "./bot";
import {Collection} from 'discord.js';
import fs from "fs";
import { CommandHandler } from "./commandHandler";

export class CommandLoader{

  private bot : Bot;
  constructor (bot: Bot){
    this.bot = bot;
  }

  public loadCommands() {
    this.bot.commands = new Collection();
    fs.readdir("./target/commands/", (err, files) => {
      if (err)
        console.error(err);
      else {
        if (files.length <= 0) {
          console.info("No files in ./commands/");
        }
        else {
          let commandFiles = files.filter((file) => file.endsWith(".js"));
          if (commandFiles.length <= 0) {
            console.info("No javascript or typescript files found in ./commands/");
          }
          else {
            this.loadCommandFiles(commandFiles);
          }
        }
        if (this.bot.commands.size <= 0) {
          console.info("No commands loaded");
        }
      }
    });
  }
  private loadCommandFiles(files: string[]) {
    files.forEach((commandFile) => {
      let commandHandlerClass  = require(`../commands/${commandFile}`).default;
      let commandHandler : CommandHandler= new commandHandlerClass() as CommandHandler;
      this.registerCommandHandles(commandHandler);
    });
  }
  private registerCommandHandles(commandHandler : CommandHandler) {
    commandHandler.meta.command.forEach((meta) => {
      this.registerCommandMetaHandles(meta, commandHandler);
    });
  }
  private registerCommandMetaHandles(meta : CommandHandler["meta"]["command"][0], command : CommandHandler) {
    meta.handles.forEach((handle) => {
      if (this.bot.handleIsRegistered(handle)) {
        console.error(`Duplicate handle: ${handle} exists in ${command.meta.id} `
          + `and ${this.bot.commands.get(handle).meta.id}. `
          + `Handle claim for ${command.meta.id} is discarded.`);
      }
      else {
        this.bot.commands.set(handle, command);
      }
    });
  }
}
