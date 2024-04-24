import type { Awaitable, ClientEvents } from "discord.js";

declare global {
  type TClientEventsCallback<K extends keyof ClientEvents> = (
    ...args: ClientEvents[K]
  ) => Awaitable<void>;

  interface TClientEvents<K extends keyof ClientEvents> {
    once: boolean;
    event: K;
    callback: TClientEventsCallback<K>;
  }
}
