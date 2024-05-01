import { inspect } from "util";
import { Events } from "discord.js";
import { scheduleJob } from "node-schedule";
import tasks from "@/tasks";
import commands from "@/commands/slash";

const ready: TClientEvents<Events.ClientReady> = {
  once: true,
  event: Events.ClientReady,
  callback: async (client) => {
    logger.info(`[Client] Fetch application -> Client(${client.user.id})`);

    client.guilds.cache.forEach((guild) => {
      logger.info(`[Client] Found guild -> Guild(${guild.id}, ${guild.name})`);
    });

    tasks.forEach((task) => {
      logger.info(`[Task] Add Job(${task.name}, ${task.cron})`);
      scheduleJob(task.cron, async () => {
        logger.info(`[Task] Execute Job(${task.name})`);
        await task.callback(client);
      });
    });

    await Object.entries(commands)
      .filter(([, command]) => command.initialize)
      .map(([name, command]) => {
        logger.info(`[Client] Initialize command -> ${name}`);
        try {
          return command.initialize?.(client);
        } catch (error) {
          logger.error(`[Client]\n${inspect(error)}`);
        }
      })
      .awaitAll();
  },
};

export default ready;
