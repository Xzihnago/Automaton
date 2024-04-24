import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Locale,
} from "discord.js";
import i18n from "./i18n";

const panel = (locale: Locale) => [
  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("panel.menu.MODE")
      .setPlaceholder(i18n.SelectMode[locale])
      .addOptions([
        { label: `${i18n.Repeat[locale]} ${i18n.Off[locale]}`, value: "0" },
        { label: `${i18n.Repeat[locale]} ${i18n.All[locale]}`, value: "1" },
        { label: `${i18n.Repeat[locale]} ${i18n.One[locale]}`, value: "2" },
      ]),
  ),

  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("panel.menu.OPER")
      .setPlaceholder(i18n.SelectOperation[locale])
      .addOptions([
        {
          label: `${i18n.Clear[locale]} ${i18n.Before[locale]}`,
          value: "before",
        },
        {
          label: `${i18n.Clear[locale]} ${i18n.After[locale]}`,
          value: "after",
        },
        {
          label: `${i18n.Clear[locale]} ${i18n.Current[locale]}`,
          value: "current",
        },
        { label: `${i18n.Clear[locale]} ${i18n.All[locale]}`, value: "all" },
      ]),
  ),

  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji("\u267b\ufe0f")
        .setLabel(i18n.ButtonClose[locale])
        .setCustomId("panel.button.CLOSE"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("\u2716\ufe0f")
        .setLabel(i18n.ButtonLeave[locale])
        .setCustomId("panel.button.LEAVE"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("\u2795")
        .setLabel(i18n.ButtonJoin[locale])
        .setCustomId("panel.button.JOIN"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u2139\ufe0f")
        .setLabel(i18n.ButtonQueue[locale])
        .setCustomId("panel.button.QUEUE"),
    ),
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u23ee\ufe0f")
        .setLabel(i18n.ButtonPrevious[locale])
        .setCustomId("panel.button.PREV"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u23f8\ufe0f")
        .setLabel(i18n.ButtonPause[locale])
        .setCustomId("panel.button.PAUSE"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u25b6\ufe0f")
        .setLabel(i18n.ButtonPlay[locale])
        .setCustomId("panel.button.RESUME"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u23ed\ufe0f")
        .setLabel(i18n.ButtonNext[locale])
        .setCustomId("panel.button.NEXT"),
    ),
];

export default {
  panel,
};
