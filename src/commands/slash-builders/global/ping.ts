import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("ping")
  .setNameLocalizations({
    "zh-CN": "延迟",
    "zh-TW": "延遲",
  })
  .setDescription("Show bot ping")
  .setDescriptionLocalizations({
    "zh-CN": "显示机器人延迟",
    "zh-TW": "顯示機器人延遲",
  });
