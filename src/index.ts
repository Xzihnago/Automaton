import "dotenv/config";
import dedent from "dedent";
import { Client, GatewayIntentBits } from "discord.js";

import "extensions";

logger.debug(dedent`
  [Process] Load .env
  ${makeForm("Keys", ["DISCORD_TOKEN", "DEBUG", "CACHE"])}
`);

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
await client.login(process.env.DISCORD_TOKEN);
