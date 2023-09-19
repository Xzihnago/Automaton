/* eslint-disable @typescript-eslint/no-magic-numbers */
import dedent from "dedent";
import { addOrClearGroup, sendRecord, updateGroup } from "./services";

const chatInputCommand: TChatInputCommand<"cached"> = async (interaction) => {
  const optionRoles = interaction.options.getString("roles", true);
  const optionTime = interaction.options.getString("time", true).toLowerCase();
  const optionTarget = interaction.options.getString("description", true);
  const optionSlot = interaction.options.getInteger("slots", true);
  const optionNote = interaction.options.getString("note", false) ?? "無";

  // Check option roles
  const allowRoles = optionRoles.match(
    /(<@&900555949046132786>|<@&800148947946700800>|<@&800149147545894922>|<@&1137764430210404423>|<@&944115857326489712>|<@&1124214581137510410>)/g,
  );
  if (!allowRoles) {
    logger.debug(`User(${interaction.user.id}) invalid roles, reject operation("CREATE")`);

    const content = dedent`
      身分組格式錯誤
      僅限 <@&900555949046132786> <@&800148947946700800> <@&800149147545894922> <@&1137764430210404423>
      如有疑問請洽管理員
    `;
    const message = await interaction.autoReply({ content: content, ephemeral: true });

    const detail = dedent`
      無效身分組
      輸入：${optionRoles}
    `;
    await sendRecord(message, interaction.user.id, "Create", "Reject", detail);

    return;
  }

  // Check option time
  const isNow = ["now", "現在"].includes(optionTime);
  const isTBD = ["tbd", "待定"].includes(optionTime);
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let deadline: Date;

  if (isNow) {
    deadline = new Date(Date.now() + 43200000);
  } else if (isTBD) {
    deadline = new Date(Date.now() + 1209600000);
  } else {
    try {
      deadline = Date.parseTime(optionTime, 8);
    } catch (error) {
      logger.debug((error as Error).message);

      const content = dedent`
        無效時間格式
        必填\`時:分\`
        選填\`月-日\`、\`年-月-日\`、\`月-日-年\` 分隔符可為\`-./\`任一
        時區為UTF+8
        如有疑問請洽管理員
      `;
      const message = await interaction.autoReply({ content, ephemeral: true });

      const detail = dedent`
        無效時間格式
        輸入：${Markdown.codeblocks(optionTime)}
      `;
      await sendRecord(message, interaction.user.id, "Create", "Reject", detail);

      return;
    }

    // Warp year to next closest time
    const rawTime = deadline.getTimeSeconds();
    if (deadline.getTime() < Date.now()) {
      logger.debug(`Deadline is in the past: ${deadline.toISOString()}, raw: "${optionTime}"`);

      const thisYear = new Date().getFullYear();
      deadline.setFullYear(thisYear);

      if (deadline.getTime() < Date.now()) deadline.setFullYear(thisYear + 1);
    }

    // Check deadline in 14 days
    if (deadline.getTime() > Date.now() + 1209600000) {
      const hostTime = Date.getTimeSeconds();
      const deadlineTime = deadline.getTimeSeconds();

      const content = dedent`
        時間需在未來十四天內
        主機時間：${Markdown.timestamps(hostTime)}
        解析時間：${Markdown.timestamps(deadlineTime)}
        時區為UTF+8
        如有疑問請洽管理員
      `;
      const message = await interaction.autoReply({ content, ephemeral: true });

      const parsedTime =
        deadlineTime === rawTime
          ? Markdown.timestamps(deadlineTime)
          : `${Markdown.timestamps(rawTime)} -> ${Markdown.timestamps(deadlineTime)}`;
      const detail = dedent`
        時限過久
        輸入：${Markdown.codeblocks(optionTime)}
        解析：${parsedTime}
        主機：${Markdown.timestamps(hostTime)}
      `;
      await sendRecord(message, interaction.user.id, "Create", "Reject", detail);

      return;
    }
  }

  // Prepare message
  const roles = allowRoles.join(" ");
  const time = isNow || isTBD ? optionTime : Markdown.timestamps(deadline.getTimeSeconds());
  const data = {
    roles,
    time,
    target: optionTarget,
    note: optionNote,
    slot: optionSlot,
    hostId: interaction.member.id,
    playerMajor: [],
    playerMinor: [],
    deadline,
    color: interaction.member.displayColor,
  };
  const message = await updateGroup(interaction, data);

  // Add group to cache
  addOrClearGroup(message, deadline);

  // Send record
  const detail = dedent`
    允許：${roles}
    時間：${time}
    人數：${optionSlot}
    目標：${optionTarget}
    備註：${optionNote}
  `;
  await sendRecord(message, interaction.user.id, "Create", "Success", detail);
};

export default chatInputCommand;
