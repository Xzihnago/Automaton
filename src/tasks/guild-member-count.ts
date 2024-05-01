const guildMemberCount: TSchedule = {
  name: "guildMemberCount",
  cron: "0 0 * * *",
  callback: async (client) => {
    const guild = await client.guilds.fetch("558806955380965386");
    const channel = guild.channels.resolve("1202908225335328768");
    if (!channel) return;

    await channel.setName(`伺服器人數：${guild.memberCount}`);
  },
};

export default guildMemberCount;
