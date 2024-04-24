import { format, transports, createLogger } from "winston";
import "winston-daily-rotate-file";

const fmt = format.combine(
  format.timestamp(),
  format.align(),
  format.printf((info) => `[${info.timestamp}][${info.level}]${info.message}`),
);

const console = new transports.Console({
  format: format.combine(format.colorize(), fmt),
  level: "debug",
  handleExceptions: true,
  handleRejections: true,
});

const file = new transports.DailyRotateFile({
  format: fmt,
  level: "info",
  handleExceptions: true,
  handleRejections: true,
  auditFile: "logs/.audit",
  filename: "logs/%DATE%.log",
  maxFiles: "14d",
})
  .on("rotate", (before: string, after: string) => {
    logger.warn(`[Logger] Event<rotate>: "${before}" -> "${after}"`);
  })
  .once("finish", () => process.exit(process.exitCode));

const logger = createLogger({
  exitOnError: false,
  transports: [console, file],
});

logger.debug("[Logger] Initialize");

export default logger;
