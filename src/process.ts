import dedent from "dedent";
import { config } from "dotenv";

process.once("beforeExit", (code) => {
  logger.log(code ? "error" : "info", `[Process] Event<Exit(${code})>`);
  logger.close();
});

process.once("SIGTERM", () => {
  logger.warn("[Process] Event<SIGTERM>");
  process.emit("beforeExit", 0);
});

process.once("SIGINT", () => {
  logger.warn("[Process] Event<SIGINT>");
  process.emit("beforeExit", 0);
});

const env = config();

if (env.parsed) {
  const title = "Env";
  const keys = Object.keys(env.parsed);

  const width = [title, ...keys].reduce(
    (acc, cur) => Math.max(acc, cur.length),
    0,
  );

  const lineSolid = "─".repeat(width);
  const lineDouble = "═".repeat(width);
  const lineDot = "╌".repeat(width);

  const padding = (width - title.length) / 2;
  const top = " ".repeat(padding) + title + " ".repeat(Math.ceil(padding));

  const lines = keys
    .map((key) => `│ ${key.padEnd(width)} │`)
    .join(`\n├╌${lineDot}╌┤\n`);

  logger.debug(dedent`
    [Process] Load .env
    ╭─${lineSolid}─╮
    │ ${top} │
    ╞═${lineDouble}═╡
    ${lines}
    ╰─${lineSolid}─╯
  `);
}
