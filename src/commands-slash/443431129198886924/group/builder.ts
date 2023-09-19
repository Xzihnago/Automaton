import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("group")
  .setNameLocalizations({
    "zh-CN": "开团",
    "zh-TW": "開團",
  })
  .setDescription("Create a group")
  .setDescriptionLocalizations({
    "zh-CN": "创建一个团",
    "zh-TW": "創建一個團",
  })

  .addStringOption((option) =>
    option
      .setName("roles")
      .setNameLocalizations({
        "zh-CN": "身份组",
        "zh-TW": "身分組",
      })
      .setDescription("哪些身分組可以報名　僅限：@【擁光者】、@【公會成員】、@【群組會員】（可複選）")
      .setRequired(true),
  )

  .addStringOption((option) =>
    option
      .setName("time")
      .setNameLocalizations({
        "zh-CN": "时间",
        "zh-TW": "時間",
      })
      .setDescription(
        "[UTC+8]　必填（時:分），選填（月/日）、（年/月/日）、（月/日/年），須在十四日內　範例：'9:00'、'1/1 18:00'、'20:30 01/01'",
      )
      .setRequired(true)
      .setAutocomplete(true),
  )

  .addStringOption((option) =>
    option
      .setName("description")
      .setNameLocalizations({
        "zh-CN": "描述",
        "zh-TW": "描述",
      })
      .setDescription("開團內容、目的地名稱")
      .setRequired(true),
  )

  .addIntegerOption((option) =>
    option
      .setName("slots")
      .setNameLocalizations({
        "zh-CN": "人数",
        "zh-TW": "人數",
      })
      .setDescription("剩餘需求人數（開團者不算請減一）")
      .setRequired(true)
      .setMinValue(1)
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .setMaxValue(11),
  )

  .addStringOption((option) =>
    option
      .setName("note")
      .setNameLocalizations({
        "zh-CN": "备注",
        "zh-TW": "備註",
      })
      .setDescription("範例：速通、紅框、新手可教學")
      .setRequired(false),
  );
