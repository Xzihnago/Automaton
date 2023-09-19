import { SlashCommandBuilder } from "@discordjs/builders";

export default new SlashCommandBuilder()
  .setName("play")
  .setNameLocalizations({
    "zh-CN": "播放",
    "zh-TW": "播放",
  })
  .setDescription("Play audio resource from url")
  .setDescriptionLocalizations({
    "zh-CN": "播放音乐",
    "zh-TW": "播放音樂",
  })
  .setDMPermission(false)

  .addStringOption((option) =>
    option
      .setName("url")
      .setNameLocalizations({
        "zh-CN": "链接",
        "zh-TW": "連結",
      })
      .setDescription("Link of audio resource")
      .setDescriptionLocalizations({
        "zh-CN": "音乐链接",
        "zh-TW": "音樂連結",
      })
      .setRequired(true),
  );
