const messageComponent: TMessageComponent<"cached"> = async (interaction) => {
  await interaction.update({});

  const guildPlayer = interaction.guild.player;
  if (interaction.isStringSelectMenu()) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (interaction.customId.split(".").pop()) {
      case "MODE":
        guildPlayer.queue.mode = Number(interaction.values[0]);
        logger.debug(`[${interaction.guildId}] Set player mode to ${guildPlayer.queue.mode}`);
        await guildPlayer.panel.update(true);
        return;

      case "OPER":
        guildPlayer.remove(interaction.values[0] as never);
        await guildPlayer.panel.update(true);
        return;
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (interaction.customId.split(".").pop()) {
      case "CLOSE":
        if (interaction.message.id === guildPlayer.panel.message?.id) {
          guildPlayer.pause();
          guildPlayer.leave();
          guildPlayer.panel.disable();
        }
        await interaction.deleteReply();
        return;

      case "LEAVE":
        guildPlayer.leave();
        return;

      case "JOIN":
        if (interaction.member.voice.channel) {
          guildPlayer.join(interaction.member.voice.channel);
        }
        return;

      case "QUEUE":
        guildPlayer.panel.mode =
          guildPlayer.panel.mode === guildPlayer.EPanelMode.Audio
            ? guildPlayer.EPanelMode.Queue
            : guildPlayer.EPanelMode.Audio;
        await guildPlayer.panel.update(true);
        return;

      case "PREV":
        await guildPlayer.previous();
        guildPlayer.panel.enable(interaction.message);
        return;

      case "PAUSE":
        guildPlayer.pause();
        return;

      case "RESUME":
        await guildPlayer.resume();
        guildPlayer.panel.enable(interaction.message);
        return;

      case "NEXT":
        await guildPlayer.next();
        guildPlayer.panel.enable(interaction.message);
        return;
    }
  }
};

export default messageComponent;
