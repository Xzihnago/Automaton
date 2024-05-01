import type { Awaitable, Client } from "discord.js";

declare global {
  interface TSchedule {
    name: string;
    cron: string;
    callback: (client: Client<true>) => Awaitable<void>;
  }
}
