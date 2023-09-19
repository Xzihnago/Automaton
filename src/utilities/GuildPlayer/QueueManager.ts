import { inspect } from "util";
import type { Guild } from "discord.js";
import { ERepeatMode } from "./enum";

export class QueueManager {
  public mode: ERepeatMode;

  private readonly guildId: string;

  private _items: TAudioInfo[];
  private _index: number;

  public constructor(guild: Guild) {
    this.guildId = guild.id;

    this.mode = ERepeatMode.Off;
    this._items = [];
    this._index = -1;

    void this.readQueue();
  }

  public get items() {
    return this._items;
  }

  public get index() {
    return this._index;
  }

  public get size() {
    return this._items.length;
  }

  public get isEmpty() {
    return this._items.length === 0;
  }

  public get isLast() {
    return this._index >= this._items.length - 1;
  }

  public get previous(): TAudioInfo | undefined {
    return this._items[this._index - 1];
  }

  public get now(): TAudioInfo | undefined {
    return this._items[this._index];
  }

  public get next(): TAudioInfo | undefined {
    return this._items[this._index + 1];
  }

  public add = async (audios: TAudioInfo[]) => {
    logger.debug(`[QueueManager] (${this.guildId}) Add ${inspect(audios.map((audio) => audio.title))}`);

    this._items.push(...audios);

    await this.writeQueue();
  };

  public clear = async () => {
    logger.debug(`[QueueManager] (${this.guildId}) Clear`);

    this._items = [];
    this._index = -1;

    await this.writeQueue();
  };

  public remove = async (target: "after" | "all" | "before" | "current") => {
    if (this.isEmpty) return;

    logger.debug(`[QueueManager] (${this.guildId}) Remove (${target})`);

    switch (target) {
      case "before":
        this._items = this._items.slice(this._index);
        this._index = 0;
        await this.writeQueue();
        return;

      case "after":
        this._items = this._items.slice(0, this._index + 1);
        await this.writeQueue();
        return;

      case "all":
        this._items = [];
        this._index = -1;
        await this.writeQueue();
        return;

      case "current":
        this._items.splice(this._index--, 1);
        await this.writeQueue();
        return;
    }
  };

  public skip = async (reversed = false) => {
    if (this.isEmpty) return;

    logger.debug(`[QueueManager] (${this.guildId}) Skip (${reversed ? "previous" : "next"})`);

    if (reversed) {
      switch (this.mode) {
        case ERepeatMode.Off:
          if (this._index > 0) {
            --this._index;
            await this.writeQueue();
          }
          return;

        case ERepeatMode.All:
        case ERepeatMode.One:
          this._index = this._index > 0 ? this._index - 1 : this.size - 1;
          await this.writeQueue();
          return;
      }
    } else {
      switch (this.mode) {
        case ERepeatMode.Off:
          if (!this.isLast) {
            ++this._index;
            await this.writeQueue();
          }
          return;

        case ERepeatMode.All:
        case ERepeatMode.One:
          this._index = this.isLast ? 0 : this._index + 1;
          await this.writeQueue();
          return;
      }
    }
  };

  public getNext = async () => {
    if (this.isEmpty) return;

    switch (this.mode) {
      case ERepeatMode.Off:
        if (this.isLast) return;

        ++this._index;
        await this.writeQueue();
        break;

      case ERepeatMode.All:
        if (this.isLast) this._index = -1;

        ++this._index;
        await this.writeQueue();
        break;

      case ERepeatMode.One:
        if (this._index < 0) {
          ++this._index;
          await this.writeQueue();
        }
        break;
    }

    return this._items[this._index];
  };

  private readonly readQueue = async () => {
    logger.debug(`[QueueManager] (${this.guildId}) Read queue file`);

    try {
      const data = await JSON.open<{
        mode: ERepeatMode;
        index: number;
        items: TAudioInfo[];
      }>(`configs/${this.guildId}/queue.json`);
      if (!data) return;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.mode = data.mode;
      this._items = data.items;
      this._index = data.index;

      if (this._index > -1) --this._index;
    } catch (error) {
      logger.error(`[QueueManager] (${this.guildId}) Read queue error: \n${(error as Error).stack}`);
    }
  };

  private readonly writeQueue = async () => {
    logger.debug(`[QueueManager] (${this.guildId}) Write queue file`);

    try {
      const data = { mode: this.mode, index: this._index, items: this._items };
      await JSON.save(`configs/${this.guildId}/queue.json`, data);
    } catch (error) {
      logger.error(`[QueueManager] (${this.guildId}) Write queue error: \n${(error as Error).stack}`);
    }
  };
}
