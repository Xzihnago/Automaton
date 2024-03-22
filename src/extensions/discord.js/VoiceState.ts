import { PermissionFlagsBits, VoiceState } from "discord.js";
import { getVoiceConnection, joinVoiceChannel, type VoiceConnection } from "@discordjs/voice";

declare module "discord.js" {
  interface VoiceState {
    VoiceConnectionError: typeof VoiceConnectionError;

    join: () => VoiceConnection;
    leave: () => VoiceConnection | undefined;
  }
}

enum VoiceConnectionError {
  NoVoiceChannel,
  NoVoiceConnection,
  MissingPermissions,
}

VoiceState.prototype.VoiceConnectionError = VoiceConnectionError;

VoiceState.prototype.join = function () {
  const channel = this.channel;

  if (!channel) {
    throw Error("No voice channel to join.");
  }

  if (!channel.permissionsFor(this.client.user)?.has(PermissionFlagsBits.Connect | PermissionFlagsBits.Speak)) {
    throw Error("Missing permissions to join or speak in the voice channel.");
  }

  return joinVoiceChannel({
    channelId: channel.id,
    guildId: this.guild.id,
    adapterCreator: this.guild.voiceAdapterCreator,
  });
};

VoiceState.prototype.leave = function () {
  const connection = getVoiceConnection(this.guild.id);
  connection?.destroy();

  return connection;
};
