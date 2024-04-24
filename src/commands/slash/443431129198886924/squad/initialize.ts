import { inlineCode, type TextBasedChannel } from "discord.js";
import dedent from "dedent";
import { parseSquadEmbed, sendRecord, setupSquad } from "./util";

const initialize: TInitialize = async (client) => {
  const groupCache =
    (await JSON.read<TGroupCache[]>("configs/443431129198886924/squad.json")) ??
    [];

  void (await groupCache
    .map(async ([channelId, messageId]) => {
      const channel = client.channels.resolve(channelId) as TextBasedChannel;

      const message = await channel.messages.fetch(messageId);
      const squadInfo = parseSquadEmbed(message);

      const time = squadInfo.deadline.getTime() - Date.now();
      if (time < 0) {
        await message.edit({ content: "募集已結束", components: [] });
        return;
      }

      await setupSquad(message, time);
      await sendRecord(
        message,
        client.user.id,
        "Success",
        "Initialize",
        dedent`
          主機重啟，加入待處理清單
          剩餘時間：${inlineCode(String(Math.floor(time / 60000)))} 分
        `,
      );
    })
    .awaitAll());
};

export default initialize;
