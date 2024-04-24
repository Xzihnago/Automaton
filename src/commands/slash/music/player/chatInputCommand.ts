import { inlineCode } from "discord.js";
import i18n from "./i18n";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const player = interaction.guild.player;

  switch (interaction.options.getSubcommand(true)) {
    case "pause":
      player.pause();
      await interaction.tryReply(i18n.AudioPause[interaction.locale]);
      return;

    case "resume":
      if (interaction.member.voice.join()) {
        await player.resume();
        await interaction.tryReply(i18n.AudioResume[interaction.locale]);
      } else {
        await interaction.tryReply(
          i18n.CannotJoinVoiceChannel[interaction.locale],
        );
      }
      return;

    case "previous":
      if (player.queue.isEmpty) {
        await interaction.tryReply({
          content: i18n.QueueEmpty[interaction.locale],
          ephemeral: true,
        });
      } else {
        await player.prev();
        await interaction.tryReply(
          i18n.AudioPlay[interaction.locale] +
            inlineCode(String(player.queue.now?.title)),
        );
      }
      return;

    case "next":
      if (player.queue.isEmpty) {
        await interaction.tryReply({
          content: i18n.QueueEmpty[interaction.locale],
          ephemeral: true,
        });
      } else {
        await player.next();
        await interaction.tryReply(
          i18n.AudioPlay[interaction.locale] +
            inlineCode(String(player.queue.now?.title)),
        );
      }
      return;
  }
};

export default chatInputCommand;
