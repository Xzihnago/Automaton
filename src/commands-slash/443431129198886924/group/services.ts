import dedent from "dedent";
import { type ChatInputCommandInteraction, type Embed, EmbedBuilder, Message } from "discord.js";
import actionrow from "./actionrow";

const groupCache: TGroupCache[] = [];

export const sendRecord = async (
  message: Message<true>,
  userId: string,
  operation: "CANCEL" | "Complete" | "Create" | "EDIT" | "Initialize" | "MAJOR" | "MINOR",
  status: "Fail" | "Reject" | "Success",
  detail?: string,
) => {
  const channel =
    message.guild.channels.resolve("1081936740358574120") ??
    (await message.guild.channels.fetch("1081936740358574120").catch(() => undefined));
  if (!(channel && channel.isTextBased())) return;

  const color = { Reject: 0xff0000, Fail: 0xffcc00, Success: 0x00ff00 }[status];
  const url = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("操作紀錄")
    .setURL(url)
    .setTimestamp()
    .addFields(
      { name: "使用者", value: Markdown.mentionUser(userId), inline: true },
      { name: "操作", value: Markdown.codeblocks(operation), inline: true },
      { name: "狀態", value: Markdown.codeblocks(status), inline: true },
    );

  if (detail) embed.addFields({ name: "詳細", value: detail });

  await channel.send({ embeds: [embed] });
};

export const getGroupInfo = async (message: Message<true>): Promise<TGroupInfo | undefined> => {
  const embed = message.embeds[0] as Embed | undefined;

  // Check if embed exist
  if (!(embed?.description && embed.timestamp)) {
    logger.warn(`group(${message.id}) embed not found, bugged!`);

    await message.reply(dedent`
      發生問題了！機器人無法獲取開團詳細資訊，這不應該發生
      可能是由於主機發生網路錯誤或開團訊息初始化失敗造成的
      如果問題持續，請通知管理員
    `);

    return;
  }

  // TODO: Check if embed is valid
  return {
    roles: embed.description,
    time: embed.fields[0].value,
    target: embed.fields[1].value,
    note: embed.fields[2].value,
    slot: Number(embed.fields[4].name.split("/")[1]),

    hostId: embed.fields[3].value.slice(2, -1),
    playerMajor: embed.fields[4].value.match(/<@\d+>/g) ?? [],
    playerMinor: embed.fields[5].value.match(/<@\d+>/g) ?? [],
    deadline: new Date(embed.timestamp),
    color: embed.color,
  };
};

export const updateGroup = (async (message, data) => {
  const { roles, time, target, note, slot, hostId, playerMajor, playerMinor, deadline, color } = data;

  const content = `${roles}　${target}　-${slot - playerMajor.length}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("遊戲招募開團")
    .setDescription(roles)
    .setFooter({ text: "截止於" })
    .setTimestamp(deadline)
    .addFields(
      { name: "開始時間", value: time, inline: true },
      { name: "目標", value: target, inline: true },
      { name: "備註", value: note, inline: true },
      { name: "開團者", value: Markdown.mentionUser(hostId) },
      { name: `主要參加者　${playerMajor.length}/${slot}`, value: playerMajor.join("\n") || "無" },
      { name: "後補", value: playerMinor.join("\n") || "無", inline: false },
    );

  if (message instanceof Message) {
    await message.edit({
      allowedMentions: {
        roles: ["900555949046132786", "800148947946700800", "800149147545894922", "1137764430210404423"],
      },
      content,
      embeds: [embed],
    });
  } else {
    return await message.autoReply({
      allowedMentions: {
        roles: ["900555949046132786", "800148947946700800", "800149147545894922", "1137764430210404423"],
      },
      content,
      embeds: [embed],
      components: actionrow.group,
    });
  }
}) as <T extends ChatInputCommandInteraction<"cached"> | Message<true>>(
  message: T,
  data: TGroupInfo,
) => Promise<T extends Message<true> ? undefined : Message<true>>;

export const addOrClearGroup = (message: Message<true>, deadline?: Date) => {
  if (!deadline) {
    logger.debug(`Clear group(${message.id}) from awaiting list`);

    groupCache.remove([message.channelId, message.id]);
    void JSON.save("configs/443431129198886924/group.json", groupCache);

    clearTimeout(awaitingGroups[message.id]);
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete awaitingGroups[message.id];

    return;
  }

  if (!(awaitingGroups[message.id] as NodeJS.Timeout | undefined)) {
    logger.debug(`Add group(${message.id}) to awaiting list`);

    groupCache.push([message.channelId, message.id]);
    void JSON.save("configs/443431129198886924/group.json", groupCache);

    awaitingGroups[message.id] = setTimeout(
      (async () => {
        await endGroup(await message.fetch());
      }) as () => void,
      deadline.getTime() - Date.now(),
    );
  }
};

const endGroup = async (message: Message<true>) => {
  // Get data
  const data = await getGroupInfo(message);
  if (!data) return;

  const { time, target, slot, hostId, playerMajor, playerMinor } = data;
  const isNow = ["now", "現在"].includes(time);
  const isTBD = ["tbd", "待定"].includes(time);

  // Clear group from cache
  addOrClearGroup(message);
  await message.edit({ content: `［募集已結束］　${target}`, components: [] });

  // Reply result if not isNow or isTBD
  if (!(isNow || isTBD)) {
    if (playerMajor.length >= slot) {
      await message.reply(dedent`
        募集時間已過，人員已滿　☆桿蟹資瓷☆
        ${Markdown.mentionUser(hostId)} ${playerMajor.join(" ")}
      `);
    } else if (playerMajor.length + playerMinor.length >= slot) {
      await message.reply(dedent`
        募集時間已過，主要參加者人數不足，使用候補名單
        ${Markdown.mentionUser(hostId)} ${[...playerMajor, ...playerMinor].slice(0, slot).join(" ")}
      `);
    } else {
      await message.reply(dedent`
        募集時間已過，人員不足，請再接再厲
        ${Markdown.mentionUser(hostId)}
      `);
    }
  }

  await sendRecord(message, hostId, "Complete", "Success");
};

const awaitingGroups: Record<string, NodeJS.Timeout> = {};
