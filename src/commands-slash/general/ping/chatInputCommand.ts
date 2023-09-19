import { EmbedBuilder } from "discord.js";

const chatInputCommand: TChatInputCommand = async (interaction) => {
  const gatewayLatency = interaction.client.ws.ping;
  const hostLatency = Date.now() - interaction.createdTimestamp;

  logger.info(`Interaction: API Latency[${gatewayLatency}ms], Host Latency[${hostLatency}ms]`);

  const embed = new EmbedBuilder()
    .setColor(interaction.getColor())
    .setTitle("Client Latency")
    .setFields([
      { name: "Gateway", value: `${gatewayLatency}ms`, inline: true },
      { name: "Host", value: `${hostLatency}ms`, inline: true },
    ]);

  await interaction.autoReply({ embeds: [embed] });
};

export default chatInputCommand;
