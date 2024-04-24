import {
  MessageComponentInteraction,
  EmbedBuilder,
  DiscordAPIError,
  inlineCode,
} from "discord.js";

declare module "discord.js" {
  interface MessageComponentInteraction<Cached extends CacheType = CacheType> {
    tryUpdate: (
      options: InteractionUpdateOptions | MessagePayload | string,
    ) => Promise<void>;

    tryReply: (
      options: Error | InteractionReplyOptions | MessagePayload | string,
    ) => Promise<Message<Cached extends undefined ? boolean : true>>;
  }
}

MessageComponentInteraction.prototype.tryUpdate = async function (options) {
  if (!this.replied) {
    try {
      await this.update(options);
    } catch (error) {
      if (!(error instanceof DiscordAPIError && error.code === 10062))
        throw error;
    }
  }
};

MessageComponentInteraction.prototype.tryReply = async function (options) {
  if (options instanceof Error) {
    const embed = new EmbedBuilder()
      .setColor(0xdc3545)
      .setTitle("Error")
      .setDescription(inlineCode(`${options.name}: ${options.message}`));

    return await this.message.edit({
      content: this.message.content,
      embeds: [...this.message.embeds, embed],
      files: [...this.message.attachments.values()],
      components: this.message.components,
    });
  }

  if (this.replied) {
    return await this.message.edit(options as never);
  } else if (this.deferred) {
    return await this.editReply(options);
  } else {
    return await this.reply(options)
      .then((res) => res.fetch())
      .catch(async (error: unknown) => {
        if (error instanceof DiscordAPIError && error.code === 10062) {
          const wsRTT = this.client.ws.ping;
          const msgRTT = Date.now() - this.createdTimestamp;
          logger.warn(`Gateway RTT(${wsRTT}ms), Message RTT(${msgRTT}ms)`);

          return await this.message.reply(options as never);
        }

        throw error;
      });
  }
};
