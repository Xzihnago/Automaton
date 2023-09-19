import actionrow from "./actionrow";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const message = await interaction.autoReply({ components: actionrow.panel(interaction.getLocale()) });
  interaction.guild.player.panel.enable(message);
};

export default chatInputCommand;
