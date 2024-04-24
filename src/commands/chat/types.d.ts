import type { Message } from "discord.js";

declare global {
  interface TChatCommand<InGuild extends boolean = boolean> {
    name: string;
    pattern: RegExp;
    callback: (message: Message<InGuild>) => Awaitable<void>;
  }
}
