import { EmbedBuilder } from "discord.js";

const re = /https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+/g;

const messageLink: TChatCommand<true> = {
  name: "message-link",
  pattern: re,
  callback: async (message) => {
    const embeds = await message.content
      .match(re)
      ?.map(async (url) => {
        const messageId = url.split("/").pop() ?? "";
        const msg =
          message.channel.messages.resolve(messageId) ??
          (await message.channel.messages.fetch(messageId));

        if (msg.content) {
          return [
            new EmbedBuilder()
              .setColor(msg.getColor())
              .setAuthor({
                name: msg.author.displayName,
                iconURL: msg.author.displayAvatarURL(),
              })
              .setDescription(msg.content)
              .setTimestamp(msg.createdTimestamp),
            ...msg.embeds,
          ];
        } else {
          return msg.embeds;
        }
      })
      .awaitAll()
      .then((embeds) => embeds.flat().slice(0, 10));

    if (embeds?.length) {
      await message.reply({ embeds });
    }
  },
};

export default messageLink;
