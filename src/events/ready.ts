import { inspect } from "util";
import { Events } from "discord.js";
import commands from "@/commands/slash";

const ready: TClientEvents<Events.ClientReady> = {
  once: true,
  event: Events.ClientReady,
  callback: async (client) => {
    logger.info(`[Client] Fetch application -> Client(${client.user.id})`);

    client.guilds.cache.forEach((guild) => {
      logger.info(`[Client] Found guild -> Guild(${guild.id}, ${guild.name})`);
    });

    void (await Object.entries(commands)
      .filter(([, command]) => command.initialize)
      .map(([name, command]) => {
        logger.info(`[Client] Initialize command -> ${name}`);
        try {
          return command.initialize?.(client);
        } catch (error) {
          logger.error(`[Client] Initialize command\n${inspect(error)}`);
        }
      })
      .awaitAll());
  },
};

export default ready;
