import type { CacheType } from "discord.js";

export type IsInGuild<Cached extends CacheType = CacheType> = Cached extends undefined ? boolean : true;
