const getDuelMessage = (source: string, target: string) => {
  const skills = {
    normal: {
      水球: 10,
      水柱: 15,
      水槍: 20,

      火球: 10,
      火焰: 15,
      火箭: 20,

      風刃: 10,
      風暴: 15,
      颶風: 20,

      落石: 10,
      地裂: 15,
      地震: 20,

      雷擊: 20,

      聖光: 20,

      黑暗: 20,
    },

    special: [
      (source: string, target: string) =>
        `<@${source}> 發動了 \`爆裂魔法\`\n<@${target}> 被燒成了灰燼`,
      (source: string, target: string) =>
        `<@${source}> 使用了 \`液壓機\`\n<@${target}> 成功進入二次元`,
    ],
  };

  if (Math.random() < 0.1) {
    return skills.special[Math.floor(Math.random() * skills.special.length)](
      source,
      target,
    );
  } else {
    const entireSkill = Object.entries(skills.normal);
    const skill = entireSkill[Math.floor(Math.random() * entireSkill.length)];
    return `<@${source}> 對 <@${target}> 使用了 \`${skill[0]}\`\n造成了 \`${skill[1]}\` 點傷害`;
  }
};

const duel: TChatCommand = {
  name: "duel",
  pattern: /duel|決鬥/,
  callback: async (message) => {
    const targets = message.mentions.members;
    if (!targets) return;

    const channel = message.channel;
    const source = message.author;
    const awaiting = [];
    for (const [id] of targets) {
      switch (id) {
        case message.client.application.owner?.id:
          awaiting.push(channel.send("無事發生"));
          break;

        case message.client.user.id:
          awaiting.push(channel.send("不可以壞壞"));
          break;

        default: {
          awaiting.push(channel.send(getDuelMessage(source.id, id)));
          break;
        }
      }
    }
    await Promise.all(awaiting);
  },
};

export default duel;
