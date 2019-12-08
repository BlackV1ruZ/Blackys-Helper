import { Client, TextChannel, Collection } from "discord.js";
import { CommandLoader } from "./commandLoader";
import { CommandHandler } from "./commandHandler";
import * as config from "config-yml";

export class Bot {
  public client: Client;
  public active_channels: Array<channelMapping>;
  public commands : Collection<string, CommandHandler>;
  private commandLoader : CommandLoader;

  constructor(){
    this.client = new Client({ disableEveryone: true });
    this.commandLoader = new CommandLoader(this);
    this.init();
  }

  public mapChannels() : void{
    this.active_channels=config.discord.channel_ids.map((t: string)  => {
      let channel = this.client.channels.get(t);
      if (channel.type === "text") {
       return new channelMapping(t, (<TextChannel> channel).name);
      } else {
        console.error(`Channel with ID: ${t} is not a TextChannel!`);
      }
    })
  }

  public handleIsRegistered(handle) : Boolean{
    return this.commands.has(handle);
  }


  private init() : void {
    this.commandLoader.loadCommands();
    this.client.on("channelUpdate", () => this.mapChannels);
    this.client.on("channelCreate", () => this.mapChannels);
    this.client.on("channelDelete", () => this.mapChannels);
    this.client.on("resume", () => this.mapChannels);
    this.client.on("ready", async () => {
      console.log(`${this.client.user.username} is online and kicking!`);
      this.client.user.setActivity(config.messages.activity.message, 
        {type: config.messages.activity.type});
      this.mapChannels();
    });
  }

  public login() {
    this.client.login(config.discord.bot_token);
  }
}

export class channelMapping {
  constructor(
    public id: string,
    public name: string
  ) { };
}
