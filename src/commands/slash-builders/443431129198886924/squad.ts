import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("squad")
  .setNameLocalizations({
    "zh-CN": "开团",
    "zh-TW": "開團",
  })
  .setDescription("Create a squad")
  .setDescriptionLocalizations({
    "zh-CN": "创建一个队伍",
    "zh-TW": "創建一個隊伍",
  })

  .addStringOption((option) =>
    option
      .setName("roles")
      .setNameLocalizations({
        "zh-CN": "身份组",
        "zh-TW": "身分組",
      })
      .setDescription("@擁光者 @公會成員 @社群會員　(Multiple selection)")
      .setDescriptionLocalizations({
        "zh-CN": "@擁光者 @公會成員 @社群會員　（复选）",
        "zh-TW": "@擁光者 @公會成員 @社群會員　（複選）",
      })
      .setRequired(true),
  )

  .addStringOption((option) =>
    option
      .setName("time")
      .setNameLocalizations({
        "zh-CN": "时间",
        "zh-TW": "時間",
      })
      .setDescription("(UTC+8)　[[Y/]M/D[/Y]] <hh:mm>　must be within 14 days")
      .setDescriptionLocalizations({
        "zh-CN": "(UTC+8)　[[年/]月/日[/年]] <时:分>　须在十四日内",
        "zh-TW": "(UTC+8)　[[年/]月/日[/年]] <時:分>　須在十四日內",
      })
      .setRequired(true),
  )

  .addStringOption((option) =>
    option
      .setName("description")
      .setNameLocalizations({
        "zh-CN": "描述",
        "zh-TW": "描述",
      })
      .setDescription("Content of the squad, destination name")
      .setDescriptionLocalizations({
        "zh-CN": "开团内容、目的地名称",
        "zh-TW": "開團內容、目的地名稱",
      })
      .setRequired(true),
  )

  .addIntegerOption((option) =>
    option
      .setName("vacancy")
      .setNameLocalizations({
        "zh-CN": "人数",
        "zh-TW": "人數",
      })
      .setDescription("Number of people required (excluding the host)")
      .setDescriptionLocalizations({
        "zh-CN": "需求人数（开团者除外）",
        "zh-TW": "需求人數（開團者除外）",
      })
      .setRequired(true)
      .setMinValue(1),
  )

  .addStringOption((option) =>
    option
      .setName("note")
      .setNameLocalizations({
        "zh-CN": "备注",
        "zh-TW": "備註",
      })
      .setDescription("Ex: Speedrun, Teaching")
      .setDescriptionLocalizations({
        "zh-CN": "范例：速通、教学",
        "zh-TW": "範例：速通、教學",
      }),
  );
