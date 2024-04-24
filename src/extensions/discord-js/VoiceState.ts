import { PermissionFlagsBits, VoiceState } from "discord.js";
import {
  getVoiceConnection,
  joinVoiceChannel,
  type VoiceConnection,
} from "@discordjs/voice";

declare module "discord.js" {
  interface VoiceState {
    join: () => VoiceConnection | undefined;
    leave: () => VoiceConnection | undefined;
  }
}

VoiceState.prototype.join = function () {
  if (!this.channel) return;

  if (!this.channel.permissionsFor(this.client.user)?.has(voicePermissions))
    return;

  return joinVoiceChannel({
    channelId: this.channel.id,
    guildId: this.guild.id,
    adapterCreator: this.guild.voiceAdapterCreator,
  });
};

VoiceState.prototype.leave = function () {
  const connection = getVoiceConnection(this.guild.id);
  connection?.destroy();

  return connection;
};

const voicePermissions = [
  PermissionFlagsBits.Connect,
  PermissionFlagsBits.Speak,
];
