import { scheduleJob } from "node-schedule";

const tasks: TSchedule[] = [];

for (const task of tasks) {
  logger.info(
    `[Task] Add schedule job -> name("${task.name}"), cron("${task.cron}")`,
  );
  scheduleJob(task.cron, task.callback);
}
