import { Events } from "discord.js";
import commands from "commands-chat";

const messageCreate: TClientEvents<Events.MessageCreate> = {
  once: false,
  event: Events.MessageCreate,
  handler: async (message) => {
    if (message.author.id === message.client.user.id) return;

    const awaiting = [];
    for (const pattern of commands.filter((command) => command.match.test(message.content))) {
      logger.debug(`Execute pattern "${pattern.name}"`);
      awaiting.push(pattern.implement(message));
    }
    await Promise.all(awaiting);
  },
};

export default messageCreate;
