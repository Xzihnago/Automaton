import { SlashCommandBuilder } from "@discordjs/builders";

export default new SlashCommandBuilder()
  .setName("test")
  .setDescription("Debug: Test")

  .addSubcommand((subcommand) => subcommand.setName("exception").setDescription("Debug: throw error"))

  .addSubcommand((subcommand) => subcommand.setName("rejection").setDescription("Debug: reject error"))

  .addSubcommand((subcommand) =>
    subcommand.setName("interaction-timeout").setDescription("Debug: Test interaction timeout"),
  );
