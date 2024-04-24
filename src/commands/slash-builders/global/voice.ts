import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("voice")
  .setNameLocalizations({
    "zh-CN": "语音",
    "zh-TW": "語音",
  })
  .setDescription("Voice commands")
  .setDescriptionLocalizations({
    "zh-CN": "语音指令",
    "zh-TW": "語音指令",
  })
  .setDMPermission(false)

  .addSubcommand((subcommand) =>
    subcommand
      .setName("join")
      .setNameLocalizations({
        "zh-CN": "加入",
        "zh-TW": "加入",
      })
      .setDescription("Join bot to voice channel")
      .setDescriptionLocalizations({
        "zh-CN": "将机器人加入语音频道",
        "zh-TW": "將機器人加入語音頻道",
      }),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("leave")
      .setNameLocalizations({
        "zh-CN": "离开",
        "zh-TW": "離開",
      })
      .setDescription("Leave bot from voice channel")
      .setDescriptionLocalizations({
        "zh-CN": "将机器人离开语音频道",
        "zh-TW": "將機器人離開語音頻道",
      }),
  );
