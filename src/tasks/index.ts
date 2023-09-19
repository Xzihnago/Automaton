import { scheduleJob } from "node-schedule";

import aliveCheck from "./aliveCheck";

const tasks: TSchedule[] = [aliveCheck];

for (const task of tasks) {
  logger.info(`[Task] Register schedule job -> Name("${task.name}"), cron("${task.cron}")`);
  scheduleJob(task.cron, task.callback);
}
