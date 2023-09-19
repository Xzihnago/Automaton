import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

logger.debug(`[Process] Env\n  DEBUG=${process.env.DEBUG}\n  CACHE=${process.env.CACHE}`);

import "extensions";
import "process-event";
import "tasks";
import registerEventHandler from "events-client";

logger.info("[Client] Create");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

registerEventHandler(client);

logger.info("[Client] Login");
await client.login(process.env.DISCORD_API_TOKEN);
