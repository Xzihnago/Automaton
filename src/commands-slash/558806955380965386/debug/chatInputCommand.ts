import { inspect } from "util";

const chatInputCommand: TChatInputCommand = async (interaction) => {
  switch (interaction.options.getSubcommand(true)) {
    case "dump-storage": {
      const storage = interaction.client.guilds.cache.map((guild) => ({
        id: guild.id,
        name: guild.name,
        audioMode: guild.player.queue.mode,
        audioIndex: guild.player.queue.index,
        audioQueue: guild.player.queue.items.map((audio) => audio.title),
      }));
      logger.debug(inspect(storage, { depth: null }));

      await interaction.autoReply("Debug: Dump storage to console");

      return;
    }

    case "force-command": {
      const commandName = interaction.options.getString("command", true);
      await interaction.invoke(commandName as Parameters<typeof interaction.invoke>[0]);

      return;
    }

    case "get-locale":
      logger.debug(`Debug get locale: User(${interaction.locale}), Guild(${interaction.guildLocale})`);
      await interaction.autoReply(`User(${interaction.locale}), Guild(${interaction.guildLocale})`);

      return;

    case "send-message": {
      const guildId = interaction.options.getString("guild-id", true);
      const channelId = interaction.options.getString("channel-id", true);
      const content = interaction.options.getString("content", true);

      const guild = interaction.client.guilds.resolve(guildId);
      if (!guild) {
        await interaction.autoReply("Guild not found");
        return;
      }

      const channel = guild.channels.resolve(channelId);
      if (!channel) {
        await interaction.autoReply("Channel not found");
        return;
      }

      if (!channel.isTextBased()) {
        await interaction.autoReply("Channel is not text based");
        return;
      }

      await channel.send(content);
      await interaction.autoReply("Message sent");

      return;
    }
  }
};

export default chatInputCommand;
