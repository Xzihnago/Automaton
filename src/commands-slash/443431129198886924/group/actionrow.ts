import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const group = [
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji("\u2795")
        .setLabel("參加")
        .setCustomId("group.BTN.MAJOR"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("\u2796")
        .setLabel("候補")
        .setCustomId("group.BTN.MINOR"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji("\u2716\ufe0f")
        .setLabel("取消")
        .setCustomId("group.BTN.CANCEL"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setEmoji("\ud83d\udcdd")
        .setLabel("編輯")
        .setCustomId("group.BTN.EDIT"),
    ),
];

const modal = new ModalBuilder()
  .setTitle("編輯開團資訊（限時300秒）")
  .setCustomId("group.MODAL.EDIT")
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("人數")
        .setCustomId("group.TEXT.COUNT")
        .setRequired(false)
        .setMaxLength(2),
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("目標")
        .setCustomId("group.TEXT.DESC")
        .setRequired(false)
        .setMaxLength(100),
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("備註")
        .setCustomId("group.TEXT.NOTE")
        .setRequired(false)
        .setMaxLength(100),
    ),
  );

export default {
  group,
  modal,
};
