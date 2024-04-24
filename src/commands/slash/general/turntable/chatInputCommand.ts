const turntable = [
  1, 3, 1, 5, 1, 3, 1, 10, 1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5, 1, 3, 1, 20,
] as const;

const chatInputCommand: TChatInputCommand = async (interaction) => {
  const result = turntable[Math.floor(Math.random() * turntable.length)];
  await interaction.tryReply(result.toString());
};

export default chatInputCommand;
