import { Client, GatewayIntentBits } from "discord.js";
import "@/extensions";
import "@/process";
import "@/tasks";
import events from "@/events";

logger.debug("[Client] Initialize");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

events.forEach((event) => {
  logger.debug(`[Client] Add event listener -> ${event.event}`);

  if (event.once) {
    client.once(event.event, event.callback as never);
  } else {
    client.on(event.event, event.callback as never);
  }
});

logger.debug("[Client] Login");
await client.login(process.env.DISCORD_TOKEN);
