import type { Client } from "discord.js";
import dedent from "dedent";
import { addOrClearGroup, getGroupInfo, sendRecord } from "./services";

const addCache = async (client: Client<true>, channelId: string, messageId: string) => {
  const channel = client.channels.resolve(channelId) ?? (await client.channels.fetch(channelId));
  if (!channel?.isTextBased() || channel.isDMBased()) return;

  const message = await channel.messages.fetch(messageId);
  const groupInfo = await getGroupInfo(message);

  if (groupInfo) {
    const time = groupInfo.deadline.getTime() - Date.now();
    if (time < 0) {
      logger.debug(`group(${message.id}) deadline is over, end group`);
      await message.edit({ content: "募集已結束", components: [] });
      return;
    }

    addOrClearGroup(message, groupInfo.deadline);

    const detail = dedent`
      主機重啟，重加入待處理清單
      剩餘時間：${Markdown.codeblocks(String(Math.floor(time / 60000)))}分
    `;
    await sendRecord(message, client.user.id, "Initialize", "Success", detail);
  }
};

const initialize: TInitialize = async (client) => {
  const groupCache = (await JSON.open<TGroupCache[]>("configs/443431129198886924/group.json")) ?? [];

  const awaiting = [];
  for (const [channelId, messageId] of groupCache) {
    awaiting.push(addCache(client, channelId, messageId));
  }
  await Promise.all(awaiting);
};

export default initialize;
