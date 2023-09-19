import type { ApplicationCommandOptionChoiceData } from "discord.js";

const autocomplete: TAutocomplete = async (interaction) => {
  const focused = interaction.options.getFocused(true);

  let choices: ApplicationCommandOptionChoiceData[] = [];
  switch (focused.name) {
    case "time":
      choices = [
        { name: "現在", value: "現在" },
        { name: "待定", value: "待定" },
      ];
      break;
  }

  await interaction.respond(choices);
};

export default autocomplete;
