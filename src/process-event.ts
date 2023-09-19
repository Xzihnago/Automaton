import { inspect } from "util";

process.once("beforeExit", (code) => {
  logger.log(code ? "error" : "info", `[Process] Event<Exit(${code})>`);
  setTimeout(() => process.exit(code), 1000);
});

process.once("SIGTERM", () => {
  logger.warn("[Process] Event<SIGTERM>");
  process.emit("beforeExit", 0);
});

process.once("SIGINT", () => {
  logger.warn("[Process] Event<SIGINT>");
  process.emit("beforeExit", 0);
});

process.on("uncaughtException", (error) => {
  logger.error(`[Process] Event<uncaughtException>\n${inspect(error)}`);
});

process.on("unhandledRejection", (_reason, promise) => {
  logger.error(`[Process] Event<unhandledRejection>\n${inspect(promise)}`);
});
