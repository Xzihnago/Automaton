import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("player")
  .setNameLocalizations({
    "zh-CN": "播放器",
    "zh-TW": "播放器",
  })
  .setDescription("Player: operation")
  .setDescriptionLocalizations({
    "zh-CN": "播放器操作",
    "zh-TW": "播放器操作",
  })
  .setDMPermission(false)

  .addSubcommand((subcommand) =>
    subcommand
      .setName("stop")
      .setNameLocalizations({
        "zh-CN": "停止",
        "zh-TW": "停止",
      })
      .setDescription("Player: stop")
      .setDescriptionLocalizations({
        "zh-CN": "停止播放音乐",
        "zh-TW": "停止播放音樂",
      }),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("pause")
      .setNameLocalizations({
        "zh-CN": "暂停",
        "zh-TW": "暫停",
      })
      .setDescription("Player: pause")
      .setDescriptionLocalizations({
        "zh-CN": "暂停音乐",
        "zh-TW": "暫停音樂",
      }),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("resume")
      .setNameLocalizations({
        "zh-CN": "继续",
        "zh-TW": "繼續",
      })
      .setDescription("Player: resume")
      .setDescriptionLocalizations({
        "zh-CN": "继续播放音乐",
        "zh-TW": "繼續播放音樂",
      }),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("previous")
      .setNameLocalizations({
        "zh-CN": "上一首",
        "zh-TW": "上一首",
      })
      .setDescription("Player: previous")
      .setDescriptionLocalizations({
        "zh-CN": "播放上一首音乐",
        "zh-TW": "播放上一首音樂",
      }),
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("next")
      .setNameLocalizations({
        "zh-CN": "下一首",
        "zh-TW": "下一首",
      })
      .setDescription("Player: next")
      .setDescriptionLocalizations({
        "zh-CN": "播放下一首音乐",
        "zh-TW": "播放下一首音樂",
      }),
  );
