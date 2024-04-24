import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("turntable")
  .setNameLocalizations({
    "zh-CN": "转盘",
    "zh-TW": "轉盤",
  })
  .setDescription("Turntable")
  .setDescriptionLocalizations({
    "zh-CN": "转盘",
    "zh-TW": "轉盤",
  });
