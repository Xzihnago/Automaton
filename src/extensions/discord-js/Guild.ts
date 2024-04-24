import { Guild } from "discord.js";
import GuildPlayer from "./GuildPlayer";

declare module "discord.js" {
  interface Guild {
    player: GuildPlayer;
  }
}

Object.defineProperty(Guild.prototype, "player", {
  get() {
    Object.defineProperty(this, "player", {
      value: new GuildPlayer(this as Guild),
    });

    return (this as Guild).player;
  },
});
