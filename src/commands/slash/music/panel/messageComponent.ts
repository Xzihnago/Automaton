const messageComponent: TMessageComponent<"cached"> = async (interaction) => {
  await interaction.update({});

  const player = interaction.guild.player;
  if (!player.panel.message) player.panel.message = interaction.message;

  if (interaction.isStringSelectMenu()) {
    switch (interaction.customId.split(".").pop()) {
      case "MODE":
        player.queue.mode = Number(interaction.values[0]);
        break;

      case "OPER":
        await player.clear(interaction.values[0] as never);
        break;
    }

    await player.panel.update(true);
  } else {
    switch (interaction.customId.split(".").pop()) {
      case "CLOSE":
        if (interaction.message.id === player.panel.message.id) {
          player.pause();
          interaction.member.voice.leave();
          player.panel.disable();
        }
        await interaction.deleteReply();
        return;

      case "LEAVE":
        interaction.member.voice.leave();
        return;

      case "JOIN":
        interaction.member.voice.join();
        return;

      case "QUEUE":
        if (player.panel.mode === player.PanelMode.Queue) {
          player.panel.mode = player.PanelMode.Audio;
        } else {
          player.panel.mode = player.PanelMode.Queue;
        }
        await player.panel.update(true);
        return;

      case "PREV":
        await player.prev();
        await player.panel.enable(interaction.message);
        return;

      case "PAUSE":
        player.pause();
        return;

      case "RESUME":
        await player.resume();
        await player.panel.enable(interaction.message);
        return;

      case "NEXT":
        await player.next();
        await player.panel.enable(interaction.message);
        return;
    }
  }
};

export default messageComponent;
