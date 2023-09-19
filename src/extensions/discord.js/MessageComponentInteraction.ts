import type { IsInGuild } from "./types";

import { DiscordAPIError, EmbedBuilder, MessageComponentInteraction, type MessagePayload } from "discord.js";
import { DiscordAPIErrorCodes, EColors } from "./_shared";

declare module "discord.js" {
  interface MessageComponentInteraction<Cached extends CacheType = CacheType> {
    autoUpdate: (options: InteractionUpdateOptions | MessagePayload | string) => Promise<void>;
    autoReply: (
      options: Error | InteractionReplyOptions | MessagePayload | string,
    ) => Promise<Message<IsInGuild<Cached>>>;
  }
}

MessageComponentInteraction.prototype.autoUpdate = async function (options) {
  if (!this.replied) {
    try {
      await this.update(options);
    } catch (error) {
      if (!(error instanceof DiscordAPIError && error.code === DiscordAPIErrorCodes.UnknownInteraction)) throw error;
    }
  }
};

MessageComponentInteraction.prototype.autoReply = async function (options) {
  if (options instanceof Error) {
    const embed = new EmbedBuilder()
      .setColor(EColors.Error)
      .setTitle("Error")
      .setDescription(`\`${options.name}: ${options.message}\``);

    return await this.message.edit({
      content: this.message.content,
      embeds: [...this.message.embeds, embed],
      files: [...this.message.attachments.values()],
      components: this.message.components,
    });
  }

  if (this.replied) {
    return await this.message.edit(options as MessagePayload | string);
  } else if (this.deferred) {
    return await this.editReply(options);
  } else {
    try {
      return await (await this.reply(options)).fetch();
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === DiscordAPIErrorCodes.UnknownInteraction) {
        const wsLatency = this.client.ws.ping;
        const hostLatency = Date.now() - this.createdTimestamp;
        logger.info(`Host may be overloaded: API Latency[${wsLatency}ms], Host Latency[${hostLatency}ms]`);

        return await this.message.reply(options as MessagePayload | string);
      }

      throw error;
    }
  }
};
