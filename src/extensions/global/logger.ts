import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const loggerFormat = format.combine(
  format.timestamp(),
  format.printf((info) => `[${info.timestamp}][${info.level}] ${info.message}`),
);

const logFile = new transports.DailyRotateFile({
  auditFile: "logs/.audit",
  maxFiles: "7d",
  filename: "logs/%DATE%.log",
  level: "info",
});
logFile.on("rotate", (oldFilename: string, newFilename: string) => {
  logger.info(`[Logger] Event<rotate>: "${oldFilename}" -> "${newFilename}"`);
});

const loggerTransports = [
  new transports.Console({
    format: format.combine(format.colorize(), loggerFormat),
  }),
  logFile,
];

const logger = createLogger({
  level: "debug",
  format: loggerFormat,
  transports: loggerTransports,
});

logger.info("[Logger] initialized");

export default logger;
