import { ChatInputCommandInteraction } from "discord.js";
import commands from "commands/slash";

declare module "discord.js" {
  interface ChatInputCommandInteraction {
    invoke: (name: keyof typeof commands) => Promise<void>;
  }
}

ChatInputCommandInteraction.prototype.invoke = async function (name) {
  logger.info(`[ChatInputCommandInteraction] Invoke: "${name}"`);
  await commands[name].chatInputCommand(this as never);
};
