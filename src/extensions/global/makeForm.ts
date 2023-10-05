import dedent from "dedent";

const makeForm = (title: string, keys: string[]) => {
  const width = [title, ...keys].reduce((acc, cur) => Math.max(acc, cur.length), 0);

  const lineSolid = "─".repeat(width);
  const lineDouble = "═".repeat(width);
  const lineDot = "╌".repeat(width);

  const pad = (width - title.length) / 2;
  const top = `${" ".repeat(Math.ceil(pad))}${title}${" ".repeat(pad)}`;

  const lines = keys.map((key) => `│ ${key.padEnd(width)} │`).join(`\n├╌${lineDot}╌┤\n`);

  return dedent`
      ╭─${lineSolid}─╮
      │ ${top} │
      ╞═${lineDouble}═╡
      ${lines}
      ╰─${lineSolid}─╯
    `;
};

export default makeForm;
