import {
  userMention,
  roleMention,
  type ModalMessageModalSubmitInteraction,
} from "discord.js";
import dedent from "dedent";
import actionrow from "./actionrow";
import {
  parseSquadEmbed,
  sendRecord,
  updateSquadMessage,
  squadCollectors,
} from "./util";

const messageComponent: TMessageComponent<"cached"> = async (interaction) => {
  // Get data
  const message = interaction.message;
  const player = userMention(interaction.user.id);
  const operation = String(interaction.customId.split(".").pop());
  const data = parseSquadEmbed(message);
  const {
    roles,
    desc,
    note,
    vacancy,
    playerHost,
    playerMajor,
    playerMinor,
    deadline,
  } = data;

  // Return if user not allow
  const isHost = player === playerHost;
  const isAllowRole = roles
    .match(/\d+/g)
    ?.some((roleId) => interaction.member.roles.resolve(roleId));

  if (!(isHost || isAllowRole)) {
    logger.debug(`User(${interaction.user.id}) not allow")`);
    await interaction.reply({
      allowedMentions: { roles: [] },
      content: dedent`
        噗噗 ❌
        只有 ${roles} 可以參加
      `,
      ephemeral: true,
    });

    await sendRecord(
      message,
      interaction.user.id,
      "Reject",
      operation,
      dedent`
        非法身分組
        允許：${roles}
        擁有：${interaction.member.roles.cache.map((role) => roleMention(role.id)).join(" ")}
      `,
    );
    return;
  }

  // Process operation
  let isMajorFull = false;
  switch (operation) {
    case "MAJOR":
      // Return if user is host
      if (isHost) {
        await interaction.reply({
          content: dedent`
            噗噗 ❌
            你是開團者，需要取消招募請點 \`取消\` 按鈕
          `,
          ephemeral: true,
        });
        await sendRecord(
          message,
          interaction.user.id,
          "Fail",
          operation,
          "開團者",
        );
        return;
      }

      // Return if user already in major player list
      if (playerMajor.includes(player)) {
        await interaction.reply({
          content: dedent`
            噗噗 ❌
            你已經在主要參加者名單中了
          `,
          ephemeral: true,
        });
        await sendRecord(
          message,
          interaction.user.id,
          "Fail",
          operation,
          "已於參加者名單",
        );
        return;
      }

      playerMinor.remove(player);
      if (playerMajor.length < vacancy) {
        playerMajor.push(player);
      } else {
        playerMinor.push(player);
        isMajorFull = true;
      }
      break;

    case "MINOR":
      // Return if interaction user is host
      if (isHost) {
        await interaction.reply({
          content: dedent`
            噗噗 ❌
            你是開團者，需要取消招募請點 \`取消\` 按鈕
          `,
          ephemeral: true,
        });
        await sendRecord(
          message,
          interaction.user.id,
          "Fail",
          operation,
          "開團者",
        );
        return;
      }

      // Return if player already in minor player list
      if (playerMinor.includes(player)) {
        await interaction.reply({
          content: dedent`
            噗噗 ❌
            你已經在後補名單中了
          `,
          ephemeral: true,
        });
        await sendRecord(
          message,
          interaction.user.id,
          "Fail",
          operation,
          "已於後補名單中",
        );
        return;
      }

      playerMajor.remove(player);
      playerMinor.push(player);
      break;

    case "CANCEL":
      // Close if interaction user is host
      if (isHost) {
        squadCollectors[message.id].stop();
        await sendRecord(
          message,
          interaction.user.id,
          "Success",
          operation,
          "開團者取消招募",
        );
        return;
      }

      playerMajor.remove(player);
      playerMinor.remove(player);
      break;

    case "EDIT": {
      // Return if interaction user is not host
      if (!isHost) {
        await interaction.reply({
          content: dedent`
            噗噗 ❌
            你不是開團者，無法編輯
          `,
          ephemeral: true,
        });
        await sendRecord(
          message,
          interaction.user.id,
          "Reject",
          operation,
          "非開團者",
        );
        return;
      }

      await interaction.showModal(actionrow.modal);
      await interaction
        .awaitModalSubmit({ time: 300000 })
        .then(async (modal) => {
          data.vacancy =
            Math.max(
              1,
              Number(modal.fields.getTextInputValue("squad.text.VACANCY")),
            ) || vacancy;
          data.desc = modal.fields.getTextInputValue("squad.text.DESC") || desc;
          data.note = modal.fields.getTextInputValue("squad.text.NOTE") || note;

          await updateSquadMessage(message, data);

          await sendRecord(
            message,
            interaction.user.id,
            "Success",
            operation,
            dedent`
              人數：${data.vacancy}
              目標：${data.desc}
              備註：${data.note}
            `,
          );

          await (modal as ModalMessageModalSubmitInteraction).update({});
        })
        .catch(async () => {
          logger.debug("Modal timeout");
          await sendRecord(
            message,
            interaction.user.id,
            "Fail",
            operation,
            "表單逾時",
          );
        });

      return;
    }
  }

  // Update embed
  await updateSquadMessage(message, data);
  await sendRecord(message, interaction.user.id, "Success", operation);

  // Reply instant if major player is full
  if (operation === "MAJOR" && playerMajor.length >= vacancy && !isMajorFull) {
    const duration = Math.floor((deadline.getTime() - Date.now()) / 60000);
    await interaction.reply({
      allowedMentions: { users: [playerHost.slice(2, -1)] },
      content: dedent`
        募集人數已滿
        距離最終截止時間剩餘 ${Math.floor(duration / 60)} 小時 ${duration % 60} 分鐘
        ${playerHost}

        主要參加者（暫定）：
        ${playerMajor.join(" ")}
      `,
    });
  }

  // Update button if no change
  await interaction.tryUpdate({});
};

export default messageComponent;
