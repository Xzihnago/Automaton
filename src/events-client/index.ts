import type { Client, ClientEvents } from "discord.js";
import ready from "./ready";
import message from "./message";
import interactionCreate from "./interaction";

const eventHandlerWrapper = <K extends keyof ClientEvents>(
  event: K,
  handler: TClientEventsHandler<K>,
): [K, TClientEventsHandler<K>] => [
  event,
  async (...args: ClientEvents[K]) => {
    logger.info(`[Client] Event<${event}>`);
    await handler(...args);
  },
];

const registerEventHandler = (client: Client) => {
  const events = [ready, message, interactionCreate];

  for (const event of events) {
    logger.info(`[Client] Register event handler -> ${event.event}`);
    if (event.once) {
      client.once(...eventHandlerWrapper(event.event, event.handler as never));
    } else {
      client.on(...eventHandlerWrapper(event.event, event.handler as never));
    }
  }
};

export default registerEventHandler;
