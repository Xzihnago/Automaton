const chatInputCommand: TChatInputCommand = async (interaction) => {
  switch (interaction.options.getSubcommand(true)) {
    case "err":
      await interaction.autoReply("Test err is designed to Rust, not available in Node.js");

      return;

    case "exception":
      await interaction.autoReply("Debug: Test exception handle");

      setTimeout(() => {
        throw Error("Debug Test Error");
      }, 3000);

      throw Error("Debug Test Error");

    case "rejection":
      await interaction.autoReply("Debug: Test rejection handle");

      setTimeout(() => {
        void Promise.reject(Error("Debug Test Error"));
      }, 3000);

      await Promise.reject(Error("Debug Test Error"));

      return;

    case "interaction-timeout":
      await new Promise((r) => {
        setTimeout(r, 3000);
      });

      await interaction.autoReply("Debug: Test interaction timeout handle");

      return;
  }
};

export default chatInputCommand;
