import dedent from "dedent";
import { ComponentType, EmbedBuilder, inlineCode } from "discord.js";
import { ytdl } from "@/utils";
import actionrow from "./actionrow";
import i18n from "./i18n";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  await interaction.deferReply();

  if (!interaction.member.voice.join()) {
    await interaction.tryReply(i18n.CannotJoinVoiceChannel[interaction.locale]);
    return;
  }

  const url = interaction.options.getString("url", true);
  const player = interaction.guild.player;

  if (ytdl.hasPlaylist(url)) {
    const playlist = await ytdl.playlist(url);

    if (!ytdl.isPlayable(url)) {
      await player.queue.add(playlist);
      await interaction.invoke("panel");
      await player.resume();
      return;
    }

    const collector = interaction.channel
      ?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (collector) => interaction.message?.id === collector.message.id,
        time: 60000,
      })
      .on("end", async (_, reason) => {
        if (reason === "time") await interaction.deleteReply();
      });

    collector?.on("collect", async (button) => {
      await button.update({});

      switch (button.customId.split(".").pop()) {
        case "NO":
          await player.queue.add(await ytdl.info(url));
          break;

        case "YES":
          await player.queue.add(playlist);
          break;
      }

      await interaction.invoke("panel");
      await player.resume();
      collector.stop();
    });

    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(i18n.PlaylistDiscovered[interaction.locale])
      .setFooter({
        text: `${i18n.Total[interaction.locale]} ${playlist.length}`,
      });

    playlist.slice(0, 10).forEach((ainfo, index) =>
      embed.addFields({
        name: `No. ${index + 1}`,
        value: dedent`
          [${ainfo.title}](${ainfo.url})
          ${i18n.Duration[interaction.locale]} - ${inlineCode(ainfo.duration.toTimeString())}
          ${i18n.Channel[interaction.locale]} - [${ainfo.author.name}](${ainfo.author.url})
        `,
      }),
    );

    if (playlist.length > 10) {
      embed.addFields({ name: "...", value: "..." });
    }

    await interaction.tryReply({
      embeds: [embed],
      components: actionrow.confirm(interaction.getLocale()),
    });
  } else if (ytdl.isPlayable(url)) {
    const ainfo = await ytdl.info(url);
    await player.queue.add(ainfo);
    await interaction.tryReply(
      `${i18n.Added[interaction.locale]} ${inlineCode(ainfo.title)} ${i18n.ToQueue[interaction.locale]}`,
    );

    await interaction.invoke("panel");
    await player.resume();
  } else {
    const sInfo = await ytdl.search(url);

    const collector = interaction.channel
      ?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (collector) => interaction.message?.id === collector.message.id,
        time: 60000,
      })
      .on("end", async (_, reason) => {
        if (reason === "time") await interaction.deleteReply();
      });

    collector?.on("collect", async (button) => {
      await button.update({});

      const sIndex = Number(button.customId.split(".").pop());
      await player.queue.add([sInfo[sIndex]]);

      await interaction.invoke("panel");
      await player.resume();
      collector.stop();
    });

    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(i18n.SearchResults[interaction.locale]);

    sInfo.forEach((ainfo, index) =>
      embed.addFields({
        name: `No. ${index + 1}`,
        value: dedent`
          [${ainfo.title}](${ainfo.url})
          ${i18n.Duration[interaction.locale]} - ${inlineCode(ainfo.duration.toTimeString())}
          ${i18n.Channel[interaction.locale]} - [${ainfo.author.name}](${ainfo.author.url})
        `,
      }),
    );

    await interaction.tryReply({
      embeds: [embed],
      components: actionrow.number(sInfo.length),
    });
  }
};

export default chatInputCommand;
