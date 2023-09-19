import { SlashCommandBuilder } from "@discordjs/builders";

export default new SlashCommandBuilder()
  .setName("debug")
  .setDescription("Debug commands")

  .addSubcommand((subcommand) =>
    subcommand.setName("dump-storage").setDescription("Debug: dump client storage to console"),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("force-command")
      .setDescription("Debug: force a command to run")
      .addStringOption((option) =>
        option.setName("command").setDescription("Command name to force run").setRequired(true),
      ),
  )

  .addSubcommand((subcommand) => subcommand.setName("get-locale").setDescription("Debug: get guild locale"))

  .addSubcommand((subcommand) =>
    subcommand
      .setName("send-message")
      .setDescription("Debug: send a message")
      .addStringOption((option) =>
        option.setName("guild-id").setDescription("The guild ID to send the message to").setRequired(true),
      )
      .addStringOption((option) =>
        option.setName("channel-id").setDescription("The channel ID to send the message to").setRequired(true),
      )
      .addStringOption((option) =>
        option.setName("content").setDescription("The content of the message").setRequired(true),
      ),
  );
