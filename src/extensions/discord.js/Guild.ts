import type { GuildPlayer } from "utilities";

declare module "discord.js" {
  interface Guild {
    player: GuildPlayer;
  }
}
