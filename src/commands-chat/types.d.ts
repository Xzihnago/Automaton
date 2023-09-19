import type { Message } from "discord.js";

declare global {
  interface TChatCommand {
    name: string;
    match: RegExp;
    implement: (message: Message) => Awaitable<void>;
  }
}
