import { PermissionFlagsBits } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import i18n from "./i18n";

const voicePermissions = PermissionFlagsBits.Connect | PermissionFlagsBits.Speak;

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const guildPlayer = interaction.guild.player;

  switch (interaction.options.getSubcommand(true)) {
    case "pause":
      guildPlayer.pause();
      await interaction.autoReply(i18n.AudioPause[interaction.locale]);

      return;

    case "resume":
      // Join voice channel if not joined
      if (!getVoiceConnection(interaction.guildId)) {
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

        guildPlayer.join(voiceChannel);
      }

      await guildPlayer.resume();
      await interaction.autoReply(`${i18n.AudioResume[interaction.locale]} \`${guildPlayer.queue.now?.title}\``);

      return;

    case "stop":
      guildPlayer.stop();
      await interaction.autoReply(i18n.AudioStop[interaction.locale]);

      return;

    case "previous":
      if (guildPlayer.queue.isEmpty) {
        await interaction.autoReply({ content: i18n.QueueEmpty[interaction.locale], ephemeral: true });
        return;
      }

      await guildPlayer.previous();
      await interaction.autoReply(`${i18n.AudioPrevious[interaction.locale]} \`${guildPlayer.queue.now?.title}\``);

      return;

    case "next":
      if (guildPlayer.queue.isEmpty) {
        await interaction.autoReply({ content: i18n.QueueEmpty[interaction.locale], ephemeral: true });
        return;
      }

      await guildPlayer.next();
      await interaction.autoReply(`${i18n.AudioNext[interaction.locale]} \`${guildPlayer.queue.now?.title}\``);

      return;
  }
};

export default chatInputCommand;
