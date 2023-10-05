import "dotenv/config";
import { inspect } from "util";
import {
  type APIUser,
  REST,
  Routes,
  type SlashCommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import "extensions";
import builders from "commands-slash/builders";
import builders443431129198886924 from "commands-slash/443431129198886924/builders";
import builders558806955380965386 from "commands-slash/558806955380965386/builders";

type TBuilders = Record<
  string,
  Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder
>;

const putApplicationCommands = async (clientId: string, builder: TBuilders) => {
  const timeStart = Date.now();
  const route = Routes.applicationCommands(clientId);
  const body = Object.values(builder);

  logger.info(`[Global] Put application commands ${inspect(body.map((v) => v.name))}`);
  try {
    await rest.put(route, { body });
    logger.info(`[Global] Done in ${Date.now() - timeStart}ms`);
  } catch (error) {
    logger.error(`[Global] Error\n${(error as Error).stack}`);
  }
};

const putApplicationGuildCommands = async (clientId: string, guildId: string, builder: TBuilders) => {
  const timeStart = Date.now();
  const route = Routes.applicationGuildCommands(clientId, guildId);
  const body = Object.values(builder);

  logger.info(`[${guildId}] Put application guild commands ${inspect(body.map((v) => v.name))}`);
  try {
    await rest.put(route, { body });
    logger.info(`[${guildId}] Done in ${Date.now() - timeStart}ms`);
  } catch (error) {
    logger.error(`[${guildId}] Error\n${(error as Error).stack}`);
  }
};

logger.info("[Deploy] Create REST interface");
const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? "");

const user = (await rest.get(Routes.user())) as APIUser;
logger.info(`[Deploy] Get application client(${user.id})`);

logger.info("[Deploy] Begin");
const timeStart = Date.now();

await putApplicationCommands(user.id, builders);
await putApplicationGuildCommands(user.id, "558806955380965386", {
  ...builders558806955380965386,
  ...builders443431129198886924,
});
await putApplicationGuildCommands(user.id, "443431129198886924", builders443431129198886924);

logger.info(`[Deploy] End in ${Date.now() - timeStart}ms`);
