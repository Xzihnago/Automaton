import { ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { AudioProvider } from "utilities";
import i18n from "./i18n";
import actionrow from "./actionrow";

const voicePermissions = PermissionFlagsBits.Connect | PermissionFlagsBits.Speak;

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  // Join voice channel if not joined
  if (!getVoiceConnection(interaction.guildId)) {
    // Return if member not in voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      logger.debug("Interaction: Member not in voice channel");
      await interaction.autoReply({ content: i18n.MemberNotInVoiceChannel[interaction.locale], ephemeral: true });
      return;
    }

    // Return if client not have permissions
    if (!voiceChannel.permissionsFor(interaction.client.user)?.has(voicePermissions)) {
      logger.debug("Interaction: Client missing permissions");
      await interaction.autoReply({ content: i18n.MissingPermissions[interaction.locale], ephemeral: true });
      return;
    }

    interaction.guild.player.join(voiceChannel);
  }

  // Defer reply to prevent interaction timeout
  await interaction.deferReply();

  const guildPlayer = interaction.guild.player;
  const url = interaction.options.getString("url", true);

  if (AudioProvider.hasPlaylist(url)) {
    const playlist = await AudioProvider.playlist(url);

    if (!AudioProvider.isPlayable(url)) {
      await guildPlayer.queue.add(playlist);
      await interaction.invoke("panel");
      await guildPlayer.resume();
      return;
    }

    const collectorButton = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (collector) => interaction.message?.id === collector.message.id,
      time: 60000,
    });

    collectorButton?.on("end", async (collected, reason) => {
      logger.debug(`Stoping listening button components: ${reason}, collected ${collected.size} items`);
      if (reason === "time") await interaction.deleteReply();
    });

    collectorButton?.on("collect", async (button) => {
      await button.update({});

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (button.customId.split(".").pop()) {
        case "NO":
          void guildPlayer.queue.add([await AudioProvider.info(url)]);
          break;

        case "YES":
          void guildPlayer.queue.add(playlist);
          break;
      }

      await interaction.invoke("panel");
      await guildPlayer.resume();
      collectorButton.stop();
    });

    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(i18n.PlaylistDiscovered[interaction.locale])
      .setFooter({ text: `total ${playlist.length} (max 100)` });

    playlist.slice(0, 10).forEach((ainfo, index) =>
      embed.addFields({
        name: `${index + 1}`,
        value: [
          `[${ainfo.title}](${ainfo.url})`,
          `${i18n.Duration[interaction.locale]} - \`${ainfo.duration.toTimeString()}\``,
          `${i18n.Channel[interaction.locale]} - [${ainfo.author.name}](${ainfo.author.url})`,
        ].join("\n"),
        inline: false,
      }),
    );

    if (playlist.length > 10) embed.addFields({ name: "...", value: "..." });

    await interaction.autoReply({ embeds: [embed], components: actionrow.confirm(interaction.getLocale()) });
  } else if (AudioProvider.isPlayable(url)) {
    const ainfo = await AudioProvider.info(url);
    void guildPlayer.queue.add([ainfo]);
    await interaction.autoReply(
      `${i18n.AudioAdded[interaction.locale]} \`${ainfo.title}\` ${i18n.ToQueue[interaction.locale]}`,
    );

    await interaction.invoke("panel");
    await guildPlayer.resume();
  } else {
    const srInfo = await AudioProvider.search(url);

    const collectorButton = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (collector) => interaction.message?.id === collector.message.id,
      time: 60000,
    });

    collectorButton?.on("end", async (collected, reason) => {
      logger.debug(`Stoping listening button components: ${reason}, collected ${collected.size} items`);
      if (reason === "time") await interaction.deleteReply();
    });

    collectorButton?.on("collect", async (button) => {
      await button.update({});

      const srIndex = Number(button.customId.split(".").pop());
      void guildPlayer.queue.add([srInfo[srIndex]]);

      await interaction.invoke("panel");
      await guildPlayer.resume();
      collectorButton.stop();
    });

    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(i18n.SearchResults[interaction.locale]);

    srInfo.forEach((ainfo, index) =>
      embed.addFields({
        name: `No. ${index + 1}`,
        value: [
          `[${ainfo.title}](${ainfo.url})`,
          `${i18n.Duration[interaction.locale]} - \`${ainfo.duration.toTimeString()}\``,
          `${i18n.Channel[interaction.locale]} - [${ainfo.author.name}](${ainfo.author.url})`,
        ].join("\n"),
        inline: false,
      }),
    );

    await interaction.autoReply({ embeds: [embed], components: actionrow.number(srInfo.length) });
  }
};

export default chatInputCommand;
