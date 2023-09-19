import type { IsInGuild } from "./types";

import { CommandInteraction, DiscordAPIError, EmbedBuilder, type Message, type MessagePayload } from "discord.js";
import { DiscordAPIErrorCodes, EColors } from "./_shared";

declare module "discord.js" {
  interface CommandInteraction<Cached extends CacheType = CacheType> {
    message?: Message<IsInGuild<Cached>>;

    autoReply: (
      options: Error | InteractionReplyOptions | MessagePayload | string,
    ) => Promise<Message<IsInGuild<Cached>>>;
  }
}

const makeEmbed = (interaction: CommandInteraction, error?: Error) => {
  const wsLatency = interaction.client.ws.ping;
  const hostLatency = Date.now() - interaction.createdTimestamp;

  const embed = new EmbedBuilder().addFields([
    { name: "API latency", value: Markdown.codeblocks(`${wsLatency}ms`), inline: true },
    { name: "Host latency", value: Markdown.codeblocks(`${hostLatency}ms`), inline: true },
    { name: "Call Time", value: Markdown.timestamps(Math.floor(interaction.createdTimestamp / 1000)), inline: true },
    { name: "User", value: Markdown.mentionUser(interaction.user.id), inline: true },
    { name: "Command", value: Markdown.codeblocks(interaction.commandName), inline: true },
    { name: "Options", value: Markdown.codeblocks(JSON.stringify(interaction.options.data, null, 2), "json") },
  ]);

  if (error) {
    embed.setColor(EColors.Error).setTitle("Error").setDescription(`\`${error.name}: ${error.message}\``);
  } else {
    logger.warn(`Host may be overloaded: API Latency[${wsLatency}ms], Host Latency[${hostLatency}ms]`);
    embed
      .setColor(EColors.Warning)
      .setTitle("Warning")
      .setDescription("Interaction timeout, consider host is overloaded or rate limited.");
  }

  return embed;
};

CommandInteraction.prototype.autoReply = async function (options) {
  if (options instanceof Error) {
    const embed = makeEmbed(this as CommandInteraction, options);

    return await this.autoReply({
      content: this.message?.content ?? "",
      embeds: [...(this.message?.embeds ?? []), embed],
      files: [...(this.message?.attachments.values() ?? [])],
      components: this.message?.components ?? [],
    });
  }

  if (this.replied && this.message) {
    return (this.message = await this.message.edit(options as MessagePayload | string));
  } else if (this.deferred) {
    return (this.message = await this.editReply(options));
  } else {
    try {
      return (this.message = await (await this.reply(options)).fetch());
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === DiscordAPIErrorCodes.UnknownInteraction) {
        const embed = makeEmbed(this as CommandInteraction);
        const message = await this.channel?.send({ embeds: [embed] });

        return (this.message = (await message?.reply(options as MessagePayload | string)) as Message);
      } else if (isErrnoException(error) && error.code === "EAI_AGAIN") {
        return this.autoReply(options);
      }

      throw error;
    }
  }
};
