import { inspect } from "util";
import ready from "./ready";
import messageCreate from "./message-create";
import interactionCreate from "./interaction-create";

const events = [ready, messageCreate, interactionCreate] as const;

events.forEach((event) => {
  const callback = event.callback;
  event.callback = async (...args: Parameters<typeof callback>) => {
    logger.info(`[Client] Event<${event.event}>`);

    try {
      await callback(...(args as unknown as never[]));
    } catch (error) {
      logger.error(`[Client] Event<${event.event}>\n${inspect(error)}`);
    }
  };
});

export default events;
