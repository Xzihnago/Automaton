import { inspect } from "util";
import { Events, InteractionType, ComponentType } from "discord.js";
import commands from "@/commands/slash";

const interactionCreate: TClientEvents<Events.InteractionCreate> = {
  once: false,
  event: Events.InteractionCreate,
  callback: async (interaction) => {
    // Log interaction info
    const type = InteractionType[interaction.type];
    const user = interaction.user;
    const infos = [`I<${type}>`, `U(${user.id}, ${user.username})`];
    if (interaction.inCachedGuild()) {
      infos.push(`G(${interaction.guildId}, ${interaction.guild.name})`);
      infos.push(`C(${interaction.channelId}, ${interaction.channel?.name})`);
    }
    logger.debug(`[Interaction] ${infos.join(", ")}`);

    // Handle interaction
    if (interaction.isAutocomplete()) {
      const commandName = interaction.commandName as keyof typeof commands;
      const command = commands[commandName];
      logger.info(`[Interaction] Autocomplete -> "${commandName}"`);

      if (command.autocomplete) {
        try {
          await command.autocomplete(interaction as never);
        } catch (error) {
          logger.error(
            `[Interaction] ${commandName}.autocomplete\n${inspect(error)}`,
          );
        }
      }
    } else if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName as keyof typeof commands;
      const command = commands[commandName];
      logger.info(`[Interaction] ChatInputCommand -> "${commandName}"`);

      try {
        await command.chatInputCommand(interaction as never);
      } catch (error) {
        logger.error(
          `[Interaction] ${commandName}.chatInputCommand\n${inspect(error)}`,
        );
        await interaction.tryReply(error as Error);
      }
    } else if (interaction.isMessageComponent()) {
      const commandName = interaction.customId.split(
        ".",
      )[0] as keyof typeof commands;
      const command = commands[commandName];
      logger.info(
        `MessageComponent<${ComponentType[interaction.componentType]}> -> "${interaction.customId}"`,
      );

      if (command.messageComponent) {
        try {
          await command.messageComponent(interaction as never);
        } catch (error) {
          logger.error(
            `[Interaction] ${commandName}.messageComponent"\n${inspect(error)}`,
          );
          await interaction.tryReply(error as Error);
        }
      }
    }
  },
};

export default interactionCreate;
