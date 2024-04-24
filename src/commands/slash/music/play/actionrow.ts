import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Locale,
} from "discord.js";
import i18n from "./i18n";

const confirm = (locale: Locale) => [
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u274c")
        .setLabel(i18n.Ignore[locale])
        .setCustomId("play.button.NO"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u2b55")
        .setLabel(i18n.Confirm[locale])
        .setCustomId("play.button.YES"),
    ),
];

const number = (count: number) => {
  const row = [
    new ActionRowBuilder<ButtonBuilder>(),
    new ActionRowBuilder<ButtonBuilder>(),
  ];
  for (let i = 0; i < count; ++i) {
    row[Math.floor(i / 5)].addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel(`${i + 1}`)
        .setCustomId(`play.button.NUMBER.${i}`),
    );
  }
  if (count <= 5) row.pop();
  return row;
};

export default {
  confirm,
  number,
};
