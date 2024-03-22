import { inspect } from "util";
import {
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  type MessageComponentInteraction,
  ComponentType,
  Events,
  InteractionType,
} from "discord.js";
import commands from "commands/slash";

const interactionCreate: TClientEvents<Events.InteractionCreate> = {
  once: false,
  event: Events.InteractionCreate,
  handler: async (interaction) => {
    const type = InteractionType[interaction.type];
    const user = interaction.user;
    if (interaction.inCachedGuild()) {
      logger.info(`I<${type}>, U(${user.id}), G(${interaction.guildId}), C(${interaction.channelId})`);
      logger.debug(`U("${user.displayName}"), G("${interaction.guild.name}"), C("${interaction.channel?.name}")`);
    } else {
      logger.info(`I<${type}>, U(${user.id})`);
      logger.debug(`U("${user.displayName}")`);
    }

    if (interaction.isAutocomplete()) {
      logger.info(`Autocomplete -> "${interaction.commandName}"`);

      try {
        const command = commands[interaction.commandName as keyof typeof commands];
        if (command.autocomplete) {
          await command.autocomplete(interaction as AutocompleteInteraction<"cached">);
        }
      } catch (error) {
        logger.error(`Interaction error in "${interaction.commandName}.autocomplete"\n${inspect(error)}`);
      }
    } else if (interaction.isChatInputCommand()) {
      logger.info(`ChatInputCommand -> "${interaction.commandName}"`);

      try {
        const command = commands[interaction.commandName as keyof typeof commands];
        await command.chatInputCommand(interaction as ChatInputCommandInteraction<"cached">);
      } catch (error) {
        logger.error(`Interaction error in "${interaction.commandName}.chatInputCommand"\n${inspect(error)}`);
        await interaction.autoReply(error as Error);
      }
    } else if (interaction.isMessageComponent()) {
      logger.info(`MessageComponent<${ComponentType[interaction.componentType]}> -> "${interaction.customId}"`);

      try {
        const command = commands[interaction.customId.split(".")[0] as keyof typeof commands];
        if (command.messageComponent) {
          await command.messageComponent(interaction as MessageComponentInteraction<"cached">);
        }
      } catch (error) {
        logger.error(`Interaction error in "${interaction.customId}.messageComponent"\n${inspect(error)}`);
        await interaction.autoReply(error as Error);
      }
    }
  },
};

export default interactionCreate;
