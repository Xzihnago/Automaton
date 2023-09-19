import type { Awaitable, ClientEvents } from "discord.js";

declare global {
  type TClientEventsHandler<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => Awaitable<void>;

  interface TClientEvents<K extends keyof ClientEvents> {
    once: boolean;
    event: K;
    handler: TClientEventsHandler<K>;
  }
}
