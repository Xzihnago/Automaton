import dedent from "dedent";
import { userMention, inlineCode, time } from "discord.js";
import actionrow from "./actionrow";
import { createSquadData, sendRecord, setupSquad } from "./util";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const optionRoles = interaction.options.getString("roles", true);
  const optionTime = interaction.options.getString("time", true).toLowerCase();
  const optionDesc = interaction.options.getString("description", true);
  const optionVacancy = interaction.options.getInteger("vacancy", true);
  const optionNote = interaction.options.getString("note") ?? "無";

  // Check option roles
  const roles = optionRoles.match(
    /(<@&900555949046132786>|<@&800148947946700800>|<@&800149147545894922>|<@&944115857326489712>)/g,
  );
  if (!roles) {
    logger.debug(`[command.squad] invalid roles`);

    const message = await interaction.tryReply({
      allowedMentions: { roles: [] },
      content: dedent`
        身分組格式錯誤
        僅限 <@&900555949046132786> <@&800148947946700800> <@&800149147545894922>
        如有疑問請洽管理員
      `,
      ephemeral: true,
    });

    await sendRecord(
      message,
      interaction.user.id,
      "Reject",
      "Create",
      dedent`
        無效身分組
        輸入：${optionRoles}
      `,
    );

    return;
  }

  // Check option time
  let deadline;
  try {
    deadline = Date.tryParse(optionTime, 8).wrap();
  } catch (error) {
    logger.debug(`[command.squad] invalid time format`);

    const message = await interaction.tryReply({
      content: dedent`
        無效時間格式
        必填 \`時:分\`
        選填 \`[年/]月/日\` 或 \`月/日[/年]\`，分隔符可為 \`-\` \`.\` \`/\` 任一
        時區為 UTF+8
        如有疑問請洽管理員
      `,
      ephemeral: true,
    });

    await sendRecord(
      message,
      interaction.user.id,
      "Reject",
      "Create",
      dedent`
        無效時間格式
        輸入：${inlineCode(optionTime)}
      `,
    );

    return;
  }

  // Check deadline in 14 days
  if (deadline.getTime() > Date.now() + 1209600000) {
    const hostTime = Date.getTimeSeconds();
    const deadlineTime = deadline.getTimeSeconds();

    const message = await interaction.tryReply({
      content: dedent`
        時間需在未來 14 日內
        主機時間：${time(hostTime)}
        解析時間：${time(deadlineTime)}
        時區為 UTF+8
        如有疑問請洽管理員
      `,
      ephemeral: true,
    });

    await sendRecord(
      message,
      interaction.user.id,
      "Reject",
      "Create",
      dedent`
        無效時限
        輸入：${inlineCode(optionTime)}
        解析：${time(deadlineTime)}
        主機：${time(hostTime)}
      `,
    );

    return;
  }

  // Prepare message
  const data: ISquadData = {
    roles: roles.join(" "),
    time: time(deadline),
    desc: optionDesc,
    note: optionNote,
    vacancy: optionVacancy,
    playerHost: userMention(interaction.member.id),
    playerMajor: [],
    playerMinor: [],
    deadline,
    color: interaction.member.displayColor,
  };

  const { content, embed } = createSquadData(data);

  const message = await interaction.tryReply({
    allowedMentions: {
      roles: ["900555949046132786", "800148947946700800", "800149147545894922"],
    },
    content,
    embeds: [embed],
    components: actionrow.group,
  });

  // Send record
  await sendRecord(
    message,
    interaction.user.id,
    "Success",
    "Create",
    dedent`
      允許：${data.roles}
      時間：${data.time}
      人數：${optionVacancy}
      目標：${optionDesc}
      備註：${optionNote}
    `,
  );

  // Add squad to cache
  await setupSquad(message, deadline.getTime() - Date.now());
};

export default chatInputCommand;
