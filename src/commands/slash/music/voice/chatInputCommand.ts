import i18n from "./i18n";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const voice = interaction.member.voice;

  switch (interaction.options.getSubcommand(true)) {
    case "join":
      await interaction.tryReply({
        content: voice.join()
          ? i18n.JoinedVoice[interaction.locale]
          : i18n.CannotJoinVoiceChannel[interaction.locale],
        ephemeral: true,
      });
      return;

    case "leave":
      await interaction.tryReply({
        content: voice.leave()
          ? i18n.LeftVoice[interaction.locale]
          : i18n.CannotLeaveVoiceChannel[interaction.locale],
        ephemeral: true,
      });
      return;
  }
};

export default chatInputCommand;
