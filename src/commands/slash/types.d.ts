import type {
  Awaitable,
  Snowflake,
  Collection,
  CacheType,
  Client,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  CollectedInteraction,
} from "discord.js";

declare global {
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

  type TCollectorEnd<Interaction extends CollectedInteraction> = (
    collected: Collection<Snowflake, Interaction>,
    reason: string,
  ) => Awaitable<void>;

  interface ISlashCommand<Cached extends CacheType = CacheType> {
    initialize?: TInitialize;
    autocomplete?: TAutocomplete<Cached>;
    chatInputCommand: TChatInputCommand<Cached>;
    messageComponent?: TMessageComponent<Cached>;
  }
}
