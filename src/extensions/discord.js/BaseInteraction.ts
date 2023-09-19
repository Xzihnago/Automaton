import { BaseInteraction, type Locale } from "discord.js";

declare module "discord.js" {
  interface BaseInteraction {
    getLocale: () => Locale;
    getColor: () => ColorResolvable;
  }
}

BaseInteraction.prototype.getLocale = function () {
  return this.guild.features.includes("COMMUNITY") ? this.guildLocale : this.locale;
};

BaseInteraction.prototype.getColor = function () {
  return this.inCachedGuild() ? this.member.displayColor : this.user.accentColor ?? 0;
};
