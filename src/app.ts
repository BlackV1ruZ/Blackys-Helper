import { Bot, channelMapping } from "./utility/bot";
import * as Discord from "discord.js" ;
import * as config from "config-yml";
import * as util from "util";

const bot = new Bot();

console.debug("config:");
console.debug(util.inspect(config, false, null, true /* enable colors */));
bot.login();
