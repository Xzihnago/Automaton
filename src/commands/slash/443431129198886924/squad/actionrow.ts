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
        .setCustomId("squad.button.MAJOR"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("\u2796")
        .setLabel("候補")
        .setCustomId("squad.button.MINOR"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji("\u2716\ufe0f")
        .setLabel("取消")
        .setCustomId("squad.button.CANCEL"),
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setEmoji("\ud83d\udcdd")
        .setLabel("編輯")
        .setCustomId("squad.button.EDIT"),
    ),
];

const modal = new ModalBuilder()
  .setTitle("編輯開團資訊（限時 300 秒）")
  .setCustomId("squad.modal.EDIT")
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("人數")
        .setCustomId("squad.text.VACANCY")
        .setRequired(false)
        .setMaxLength(2),
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("目標")
        .setCustomId("squad.text.DESC")
        .setRequired(false)
        .setMaxLength(100),
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel("備註")
        .setCustomId("squad.text.NOTE")
        .setRequired(false)
        .setMaxLength(100),
    ),
  );

export default {
  group,
  modal,
};
