import { inspect } from "util";
import {
  REST,
  Routes,
  type APIUser,
  type SharedNameAndDescription,
} from "discord.js";
import "@/extensions";
import "@/process";
import builders from "@/commands/slash-builders";

const putApplicationCommands = async (
  body: SharedNameAndDescription[],
  clientId: string,
  guildId?: string,
) => {
  const timeStart = Date.now();
  const scope = guildId ?? "global";

  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  logger.info(
    `[${scope}] Put application commands ${body.map((v) => v.name).inspect()}`,
  );

  await rest
    .put(route, { body })
    .then(() => {
      logger.info(`[${scope}] Done in ${Date.now() - timeStart}ms`);
    })
    .catch((error: unknown) => {
      logger.error(`[${scope}] Error\n${inspect(error)}`);
    });
};

logger.info("[Deploy] Create REST");
const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? "");

const user = (await rest.get(Routes.user())) as APIUser;
logger.info(`[Deploy] Get Client(${user.id})`);

logger.info("[Deploy] Begin");
const timeStart = Date.now();

await Promise.all([
  putApplicationCommands(builders.global, user.id),
  putApplicationCommands(
    [...builders.$558806955380965386, ...builders.$443431129198886924],
    user.id,
    "558806955380965386",
  ),
  putApplicationCommands(
    builders.$443431129198886924,
    user.id,
    "443431129198886924",
  ),
]);

logger.info(`[Deploy] End in ${Date.now() - timeStart}ms`);
