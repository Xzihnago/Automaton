import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("panel")
  .setNameLocalizations({
    "zh-CN": "面板",
    "zh-TW": "面板",
  })
  .setDescription("Player control panel")
  .setDescriptionLocalizations({
    "zh-CN": "播放器控制面板",
    "zh-TW": "播放器控制面板",
  })
  .setDMPermission(false);
