import { PermissionFlagsBits } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import i18n from "./i18n";

const voicePermissions = PermissionFlagsBits.Connect | PermissionFlagsBits.Speak;

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  switch (interaction.options.getSubcommand(true)) {
    case "join": {
      // Return if member not in voice channel
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        logger.debug("Interaction: Member not in voice channel");
        await interaction.autoReply({ content: i18n.MemberNotInVoiceChannel[interaction.locale], ephemeral: true });
        return;
      }

      // Return if client not have permissions
      if (!voiceChannel.permissionsFor(interaction.client.user)?.has(voicePermissions)) {
        logger.debug("Interaction: Client missing permissions");
        await interaction.autoReply({ content: i18n.MissingPermissions[interaction.locale], ephemeral: true });
        return;
      }

      interaction.guild.player.join(voiceChannel);

      await interaction.autoReply(i18n.ClientJoinedVoiceChannel[interaction.locale]);
      return;
    }

    case "leave": {
      // Return if client not in voice channel
      if (!getVoiceConnection(interaction.guildId)) {
        logger.debug("Interaction: Client not in voice channel");
        await interaction.autoReply({ content: i18n.ClientNotInVoiceChannel[interaction.locale], ephemeral: true });
        return;
      }

      interaction.guild.player.leave();

      await interaction.autoReply(i18n.ClientLeftVoiceChannel[interaction.locale]);
      return;
    }
  }
};

export default chatInputCommand;
