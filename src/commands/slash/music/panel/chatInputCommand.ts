import actionrow from "./actionrow";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const message = await interaction.tryReply({
    components: actionrow.panel(interaction.getLocale()),
  });
  await interaction.guild.player.panel.enable(message);
};

export default chatInputCommand;
