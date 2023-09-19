import type {
  AutocompleteInteraction,
  Awaitable,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  MessageComponentInteraction,
  SlashCommandBuilder,
} from "discord.js";

declare global {
  type TSlashBuilder = Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  type TInitialize = (client: Client<true>) => Awaitable<void>;

  type TAutocomplete<Cached extends CacheType = CacheType> = (
    interaction: AutocompleteInteraction<Cached>,
  ) => Awaitable<void>;

  type TChatInputCommand<Cached extends CacheType = CacheType> = (
    interaction: ChatInputCommandInteraction<Cached>,
  ) => Awaitable<void>;

  type TMessageComponent<Cached extends CacheType = CacheType> = (
    interaction: MessageComponentInteraction<Cached>,
  ) => Awaitable<void>;

  interface ISlashCommand<Cached extends CacheType = CacheType> {
    initialize?: TInitialize;
    autocomplete?: TAutocomplete<Cached>;
    chatInputCommand: TChatInputCommand<Cached>;
    messageComponent?: TMessageComponent<Cached>;
  }
}
