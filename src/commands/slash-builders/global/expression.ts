import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("expression")
  .setNameLocalizations({
    "zh-CN": "表达式",
    "zh-TW": "運算式",
  })
  .setDescription("Transforms expression notation")
  .setDescriptionLocalizations({
    "zh-CN": "转换表达式表示法",
    "zh-TW": "轉換運算式表示法",
  })

  .addStringOption((option) =>
    option
      .setName("target")
      .setNameLocalizations({
        "zh-TW": "目標",
      })
      .setDescription("Target notation")
      .setDescriptionLocalizations({
        "zh-TW": "目標表示法",
      })
      .setRequired(true)
      .addChoices(
        { name: "infix", value: "infix" },
        { name: "postfix", value: "postfix" },
        { name: "prefix", value: "prefix" },
      ),
  )

  .addStringOption((option) =>
    option
      .setName("expression")
      .setNameLocalizations({
        "zh-TW": "運算式",
      })
      .setDescription("Any expression")
      .setDescriptionLocalizations({
        "zh-TW": "任意運算式",
      })
      .setRequired(true),
  );
