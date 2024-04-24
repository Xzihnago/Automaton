import type { Message } from "discord.js";

declare global {
  interface TChatCommand {
    name: string;
    pattern: RegExp;
    callback: (message: Message) => Awaitable<void>;
  }
}
