import { EmbedBuilder, inlineCode } from "discord.js";

const chatInputCommand: TChatInputCommand = async (interaction) => {
  const wsRTT = interaction.client.ws.ping;
  const msgRTT = Date.now() - interaction.createdTimestamp;

  logger.info(
    `Interaction: API Latency[${wsRTT}ms], Host Latency[${msgRTT}ms]`,
  );

  const embed = new EmbedBuilder()
    .setColor(interaction.getColor())
    .setTitle("Client Latency")
    .setFields([
      {
        name: "Gateway RTT",
        value: inlineCode(`${wsRTT}ms`),
        inline: true,
      },
      {
        name: "Message RTT",
        value: inlineCode(`${msgRTT}ms`),
        inline: true,
      },
    ]);

  await interaction.tryReply({ embeds: [embed] });
};

export default chatInputCommand;
