import { SlashCommandBuilder } from "@discordjs/builders";

export default new SlashCommandBuilder()
  .setName("player")
  .setNameLocalizations({
    "zh-CN": "播放器",
    "zh-TW": "播放器",
  })
  .setDescription("Player control")
  .setDescriptionLocalizations({
    "zh-CN": "播放器控制",
    "zh-TW": "播放器控制",
  })
  .setDMPermission(false)

  .addSubcommand((subcommand) =>
    subcommand
      .setName("stop")
      .setNameLocalizations({
        "zh-CN": "停止",
        "zh-TW": "停止",
      })
      .setDescription("Stop audio")
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
      .setDescription("Pause audio")
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
      .setDescription("Resume audio")
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
      .setDescription("Play previous audio")
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
      .setDescription("Play next audio")
      .setDescriptionLocalizations({
        "zh-CN": "播放下一首音乐",
        "zh-TW": "播放下一首音樂",
      }),
  );
