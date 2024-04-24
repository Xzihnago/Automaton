import { inspect } from "util";
import { Events, type Awaitable } from "discord.js";
import commands from "@/commands/chat";

const messageCreate: TClientEvents<Events.MessageCreate> = {
  once: false,
  event: Events.MessageCreate,
  callback: async (message) => {
    if (message.author.id === message.client.user.id) return;

    void (await commands
      .filter((command) => command.pattern.test(message.content))
      .map((command) => {
        logger.debug(`[Client] Execute chat "${command.name}"`);
        try {
          return command.callback(message) as Awaitable<void>;
        } catch (error) {
          logger.error(
            `[Client] Execute chat "${command.name}"\n${inspect(error)}`,
          );
        }
      })
      .awaitAll());
  },
};

export default messageCreate;
