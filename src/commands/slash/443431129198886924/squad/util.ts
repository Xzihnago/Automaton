import dedent from "dedent";
import {
  ComponentType,
  EmbedBuilder,
  userMention,
  inlineCode,
  type Message,
  type InteractionCollector,
  type ButtonInteraction,
} from "discord.js";
import messageComponent from "./messageComponent";

const squadCache: TGroupCache[] = [];
export const squadCollectors: Record<
  string,
  InteractionCollector<ButtonInteraction>
> = {};

export const updateSquadMessage = async (
  message: Message<true>,
  data: ISquadData,
) => {
  const { content, embed } = createSquadData(data);

  await message.edit({
    allowedMentions: {
      roles: ["900555949046132786", "800148947946700800", "800149147545894922"],
    },
    content,
    embeds: [embed],
  });
};

export const setupSquad = async (message: Message, time: number) => {
  logger.debug(`Add squad(${message.id}) to listening list`);
  squadCache.push([message.channelId, message.id]);
  await JSON.write("configs/443431129198886924/squad.json", squadCache);

  const collector = message
    .createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    })
    .on("collect", messageComponent)
    .on("end", async (_, reason) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete squadCollectors[message.id];

      logger.debug(`Clear squad(${message.id}) from listening list`);
      squadCache.remove([message.channelId, message.id]);
      await JSON.write("configs/443431129198886924/squad.json", squadCache);

      const { vacancy, playerHost, playerMajor, playerMinor } = parseSquadEmbed(
        await message.fetch(),
      );

      if (reason === "time") {
        await message.edit({ content: "募集已結束", components: [] });

        const hostId = playerHost.slice(2, -1);
        if (playerMajor.length >= vacancy) {
          await message.reply(dedent`
          募集時間已過，參加者已滿　☆桿蟹資瓷☆
          ${playerHost} ${playerMajor.join(" ")}
        `);
          await sendRecord(message, hostId, "Success", "Complete");
        } else if (playerMajor.length + playerMinor.length >= vacancy) {
          await message.reply(dedent`
          募集時間已過，主要參加者人數不足，使用候補名單
          ${playerHost} ${[...playerMajor, ...playerMinor].slice(0, vacancy).join(" ")}
        `);
          await sendRecord(message, hostId, "Success", "Complete");
        } else {
          await message.reply(dedent`
          募集時間已過，人員不足，請再接再厲
          ${playerHost}
        `);
          await sendRecord(message, hostId, "Fail", "Complete");
        }
      } else {
        await message.edit({ content: "募集已取消", components: [] });
      }
    });

  squadCollectors[message.id] = collector;
};

export const sendRecord = async (
  message: Message,
  userId: string,
  status: "Reject" | "Fail" | "Success",
  operation: string,
  detail?: string,
) => {
  const channel = message.guild?.channels.resolve("1081936740358574120");
  if (!channel?.isTextBased()) return;

  const color = { Reject: 0xdc3545, Fail: 0xffc107, Success: 0x198754 }[status];
  const url = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("操作紀錄")
    .setURL(url)
    .setTimestamp()
    .addFields(
      { name: "使用者", value: userMention(userId), inline: true },
      { name: "操作", value: inlineCode(String(operation)), inline: true },
      { name: "狀態", value: inlineCode(status), inline: true },
    );

  if (detail) embed.addFields({ name: "詳細", value: detail });

  await channel.send({ embeds: [embed] });
};

export const createSquadData = (data: ISquadData) => {
  const {
    roles,
    time,
    desc,
    note,
    vacancy,
    playerHost,
    playerMajor,
    playerMinor,
    deadline,
    color,
  } = data;

  const content = `${roles}　${desc}　-${vacancy - playerMajor.length}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("隊伍招募")
    .setDescription(roles)
    .setFooter({ text: "截止於" })
    .setTimestamp(deadline)
    .addFields(
      { name: "時間", value: time, inline: true },
      { name: "目標", value: desc, inline: true },
      { name: "備註", value: note, inline: true },
      { name: "開團者", value: playerHost },
      {
        name: `主要參加者　${playerMajor.length}/${vacancy}`,
        value: playerMajor.join("\n") || "無",
      },
      { name: "後補", value: playerMinor.join("\n") || "無", inline: false },
    );

  return { content, embed };
};

export const parseSquadEmbed = (message: Message): ISquadData => {
  const embed = message.embeds[0];

  return {
    roles: embed.description ?? "",
    time: embed.fields[0].value,
    desc: embed.fields[1].value,
    note: embed.fields[2].value,
    vacancy: Number(embed.fields[4].name.split("/")[1]),

    playerHost: embed.fields[3].value,
    playerMajor: embed.fields[4].value.split("\n").filter((v) => v !== "無"),
    playerMinor: embed.fields[5].value.split("\n").filter((v) => v !== "無"),
    deadline: new Date(embed.timestamp ?? Date.now()),
    color: embed.color,
  };
};
