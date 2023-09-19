import { EmbedBuilder } from "discord.js";
import expressions from "./expressions";

const chatInputCommand: TChatInputCommand = async (interaction) => {
  // Get parameters
  const target = interaction.options.getString("target", true) as "infix" | "postfix" | "prefix";
  const expression = interaction.options.getString("expression", true);

  // Transform expression from current notation to target notation
  const arrToken = expressions.getExpressionArray(expression);
  const original = expressions.getExpressionNotation(arrToken);
  const arrTarget = expressions.convertNotation(arrToken, original, target);

  // Reply
  const req = expressions.getExpressionString(arrToken);
  const res = expressions.getExpressionString(arrTarget);
  logger.debug(`Converted notation to ${target}: "${req}" -> "${res}"`);

  const embed = new EmbedBuilder()
    .setColor(interaction.getColor())
    .setTitle(`Convert ${original} to ${target}`)
    .setDescription(`${original}: \`${req}\`\n\n${target}: \`${res}\``);

  await interaction.autoReply({ embeds: [embed] });
};

export default chatInputCommand;
