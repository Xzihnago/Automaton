import dedent from "dedent";
import { inlineCode } from "discord.js";

const chatInputCommand: TChatInputCommand = async (interaction) => {
  switch (interaction.options.getSubcommand(true)) {
    case "test-uncaught-exception":
      await interaction.tryReply("Debug: test uncaught exception handle");
      setTimeout(() => {
        throw new Error("Debug Test Error");
      });
      return;

    case "test-unhandled-rejection":
      await interaction.tryReply("Debug: test unhandled rejection handle");
      setTimeout(() => {
        void Promise.reject(new Error("Debug Test Error"));
      });
      return;

    case "test-exception":
      throw new Error("Debug Test Error");

    case "test-rejection":
      await Promise.reject(new Error("Debug Test Error"));

    case "test-interaction-timeout":
      await wait(3000);
      await interaction.tryReply("Debug: test interaction timeout handle");
      return;

    case "dump-storage": {
      const storage = interaction.client.guilds.cache.map((guild) => ({
        id: guild.id,
        name: guild.name,
        audioMode: guild.player.queue.mode,
        audioIndex: guild.player.queue.index,
        audioQueue: guild.player.queue.items.map((audio) => audio.title),
      }));
      logger.debug(storage.inspect(undefined, null));

      await interaction.tryReply("Debug: dump storage to console");
      return;
    }

    case "force-command": {
      const commandName = interaction.options.getString("command", true);
      await interaction.invoke(commandName as never);
      return;
    }

    case "get-locale":
      await interaction.tryReply(dedent`
        User (${inlineCode(interaction.locale)})
        Guild (${inlineCode(String(interaction.guildLocale))})
      `);
      return;

    case "send-message": {
      const guildId = interaction.options.getString("guild-id", true);
      const channelId = interaction.options.getString("channel-id", true);
      const content = interaction.options.getString("content", true);

      const guild = interaction.client.guilds.resolve(guildId);
      if (!guild) {
        await interaction.tryReply("Guild not found");
        return;
      }

      const channel = guild.channels.resolve(channelId);
      if (!channel) {
        await interaction.tryReply("Channel not found");
        return;
      }
      if (!channel.isTextBased()) {
        await interaction.tryReply("Channel is not text based");
        return;
      }

      await channel.send(content).then(async () => {
        await interaction.tryReply("Success");
      });
      return;
    }
  }
};

export default chatInputCommand;
