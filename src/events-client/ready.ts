import { Events } from "discord.js";
import { GuildPlayer } from "utilities";
import commands from "commands-slash";

const ready: TClientEvents<Events.ClientReady> = {
  once: true,
  event: Events.ClientReady,
  handler: async (client) => {
    await client.application.fetch();
    logger.info(`[Client] Fetch application -> Client(${client.user.id}), Owner(${client.application.owner?.id})`);

    for (const [guildId, guild] of client.guilds.cache) {
      logger.info(`[Client] Cached -> Guild(${guildId}), Name("${guild.name}")`);
      guild.player = new GuildPlayer(guild);
    }

    logger.info("[Client] Initialize commands");
    const awaiting = [];
    for (const [name, command] of Object.entries(commands)) {
      if (command.initialize) {
        logger.info(`[Client] Initialize -> ${name}`);
        awaiting.push(command.initialize(client));
      }
    }
    await Promise.all(awaiting);
  },
};

export default ready;
