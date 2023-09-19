import type { ModalMessageModalSubmitInteraction } from "discord.js";
import dedent from "dedent";
import actionrow from "./actionrow";
import { addOrClearGroup, getGroupInfo, sendRecord, updateGroup } from "./services";

const messageComponent: TMessageComponent<"cached"> = async (interaction) => {
  // Get data
  const message = interaction.message;
  const data = await getGroupInfo(message);
  if (!data) return;

  const { roles, time, target, note, slot, hostId, playerMajor, playerMinor, deadline } = data;

  // Return if message deadline is over
  if (deadline.getTime() - Date.now() < 0) {
    logger.debug(`group(${message.id}) deadline is over, end group`);
    await message.edit({ content: "募集已結束", components: [] });
    return;
  }

  // Add group to cache and parse operation
  addOrClearGroup(message, deadline);
  const operation = interaction.customId.split(".").pop() as "CANCEL" | "EDIT" | "MAJOR" | "MINOR";

  // Return if interaction user role not in allowRoles
  const isOrganizer = interaction.member.id === hostId;
  const allowRoles = roles.match(/\d+/g) ?? ([] as string[]);
  if (!(isOrganizer || allowRoles.some((roleId) => interaction.member.roles.resolve(roleId)))) {
    logger.debug(`User(${interaction.user.id}) not in allow role, reject operation("${operation}")`);
    await interaction.reply({ content: `噗噗，只有 ${roles} 可以參加`, ephemeral: true });

    const detail = dedent`
      非法身分組
      允許：${roles}
      擁有：${interaction.member.roles.cache.map((role) => Markdown.mentionRole(role.id)).join(" ")}
    `;
    await sendRecord(message, interaction.user.id, operation, "Reject", detail);

    return;
  }

  // Do operation
  let isAutoMinor = false;
  switch (operation) {
    case "MAJOR":
      // Return if interaction user is organizer
      if (isOrganizer) {
        await interaction.reply({ content: "噗噗，你是開團者，需要取消招募請點`取消`按鈕", ephemeral: true });
        await sendRecord(message, interaction.user.id, operation, "Fail", "Organizer");
        return;
      }

      // Return if player already in major player list
      if (playerMajor.includes(Markdown.mentionUser(interaction.member.id))) {
        await interaction.reply({ content: "噗噗，你已經在主要參加者名單中了", ephemeral: true });
        await sendRecord(message, interaction.user.id, operation, "Fail", "Already in list");
        return;
      }

      playerMinor.remove(Markdown.mentionUser(interaction.member.id));
      if (playerMajor.length < slot) {
        playerMajor.push(Markdown.mentionUser(interaction.member.id));
      } else {
        playerMinor.push(Markdown.mentionUser(interaction.member.id));
        isAutoMinor = true;
      }
      break;

    case "MINOR":
      // Return if interaction user is organizer
      if (isOrganizer) {
        await interaction.reply({ content: "噗噗，你是開團者，需要取消招募請點`取消`按鈕", ephemeral: true });
        await sendRecord(message, interaction.user.id, operation, "Fail", "Organizer");
        return;
      }

      // Return if player already in minor player list
      if (playerMinor.includes(Markdown.mentionUser(interaction.member.id))) {
        await interaction.reply({ content: "噗噗，你已經在後補名單中了", ephemeral: true });
        await sendRecord(message, interaction.user.id, operation, "Fail", "Already in list");
        return;
      }

      playerMajor.remove(Markdown.mentionUser(interaction.member.id));
      playerMinor.push(Markdown.mentionUser(interaction.member.id));
      break;

    case "CANCEL":
      // Return if interaction user is organizer
      if (isOrganizer) {
        addOrClearGroup(message);
        await message.edit({ content: "募集已取消", components: [] });
        await sendRecord(message, interaction.user.id, operation, "Success", "Organizer");
        return;
      }

      playerMajor.remove(Markdown.mentionUser(interaction.member.id));
      playerMinor.remove(Markdown.mentionUser(interaction.member.id));
      break;

    case "EDIT": {
      // Return if interaction user is not organizer
      if (!isOrganizer) {
        await interaction.reply({ content: "噗噗，你不是開團者，無法編輯", ephemeral: true });
        await sendRecord(message, interaction.user.id, operation, "Reject", "Not organizer");
        return;
      }

      await interaction.showModal(actionrow.modal);

      await interaction
        .awaitModalSubmit({ time: 300000 })
        .then(async (modal) => {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          data.slot = Math.clamp(Number(modal.fields.getTextInputValue("group.TEXT.COUNT")), 1, 11) || slot;
          data.target = modal.fields.getTextInputValue("group.TEXT.DESC") || target;
          data.note = modal.fields.getTextInputValue("group.TEXT.NOTE") || note;

          await updateGroup(message, data);

          const detail = `人數：${data.slot}\n目標：${data.target}\n備註：${data.note}`;
          await sendRecord(message, interaction.user.id, operation, "Success", detail);

          await (modal as ModalMessageModalSubmitInteraction).update({});
        })
        .catch(async () => {
          logger.debug("Modal timeout");
          await sendRecord(message, interaction.user.id, operation, "Fail", "Modal timeout");
        });

      return;
    }
  }

  // Update embed
  await updateGroup(message, data);
  await sendRecord(message, interaction.user.id, operation, "Success");

  // Reply if major player is full
  const isNow = ["now", "現在"].includes(time);
  const isTBD = ["tbd", "待定"].includes(time);
  if (operation === "MAJOR" && playerMajor.length >= slot && !isAutoMinor) {
    if (isNow) {
      await interaction.reply(dedent`
        募集人數已滿　☆桿蟹資瓷☆
        開車快開車
        <@${hostId}> ${playerMajor.join(" ")}
      `);
    } else if (isTBD) {
      const duration = Math.floor((deadline.getTime() - Date.now()) / 60000);
      await interaction.reply(dedent`
        募集人數已滿　時間未定
        距離最終截止時間剩餘${Math.floor(duration / 60)}小時${duration % 60}分鐘
        <@${hostId}>
      `);
    } else {
      const duration = Math.floor((deadline.getTime() - Date.now()) / 60000);
      await interaction.reply(dedent`
        募集人數已滿
        距離最終截止時間剩餘${Math.floor(duration / 60)}小時${duration % 60}分鐘
        <@${hostId}>
      `);
    }
  }

  // Update button
  await interaction.autoUpdate({});
};

export default messageComponent;
