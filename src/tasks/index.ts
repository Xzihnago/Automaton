import { scheduleJob } from "node-schedule";

const tasks: TSchedule[] = [];

for (const task of tasks) {
  logger.info(`[Task] Register schedule job -> Name("${task.name}"), cron("${task.cron}")`);
  scheduleJob(task.cron, task.callback);
}
