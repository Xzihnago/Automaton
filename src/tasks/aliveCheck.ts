const aliveCheck: TSchedule = {
  name: "aliveCheck",
  cron: "0 * * * *",
  callback: () => {
    logger.debug("[Task] Alive check");
  },
};

export default aliveCheck;
