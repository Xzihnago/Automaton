import { CommandInteraction, DiscordAPIError } from "discord.js";

declare module "discord.js" {
  interface CommandInteraction<Cached extends CacheType = CacheType> {
    message?: Message<Cached extends undefined ? boolean : true> | undefined;

    tryReply: (
      options: Error | InteractionReplyOptions | MessagePayload | string,
    ) => Promise<Message<Cached extends undefined ? boolean : true>>;
  }
}

CommandInteraction.prototype.tryReply = async function (options) {
  if (options instanceof Error) {
    const embed = this.diagnostic()
      .setColor(0xdc3545)
      .setTitle("Error")
      .setDescription(`\`${options.name}: ${options.message}\``);

    return await this.tryReply({
      content: this.message?.content ?? "",
      embeds: [...(this.message?.embeds ?? []), embed],
      files: [...(this.message?.attachments.values() ?? [])],
      components: this.message?.components ?? [],
    });
  }

  if (this.replied && this.message) {
    return (this.message = await this.message.edit(options as never));
  } else if (this.deferred) {
    return (this.message = await this.editReply(options));
  } else {
    return (this.message = await this.reply(options)
      .then((res) => res.fetch())
      .catch(async (error: unknown) => {
        if (error instanceof DiscordAPIError && error.code === 10062) {
          const wsRTT = this.client.ws.ping;
          const msgRTT = Date.now() - this.createdTimestamp;
          logger.warn(`Gateway RTT(${wsRTT}ms), Message RTT(${msgRTT}ms)`);

          const embed = this.diagnostic()
            .setColor(0xffc107)
            .setTitle("Warning")
            .setDescription(
              "Interaction timeout, consider host is overloaded or rate limited.",
            );

          if (!this.channel) throw error;

          const message = await this.channel.send({ embeds: [embed] });
          return (this.message = await message.reply(options as never));
        }

        throw error;
      }));
  }
};
