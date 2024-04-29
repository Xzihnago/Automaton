import type { Guild } from "discord.js";

export class QueueManager {
  private _mode: QueueMode;
  public items: TAudioInfo[];
  public index: number | null;

  constructor(public readonly guild: Guild) {
    this._mode = QueueMode.Off;
    this.items = [];
    this.index = null;

    void this.read();
  }

  public get guildId() {
    return this.guild.id;
  }

  public get length() {
    return this.items.length;
  }

  public get isEmpty() {
    return this.length === 0;
  }

  public get isFirst() {
    return this.index !== null && this.index <= 0;
  }

  public get isLast() {
    return this.index !== null && this.index >= this.length - 1;
  }

  public get mode() {
    return this._mode;
  }
  public set mode(value: QueueMode) {
    logger.debug(`[QueueManager<${this.guildId}>] Mode(${QueueMode[value]})`);
    this._mode = value;
    void this.write();
  }

  public get now() {
    if (this.isEmpty || this.index === null) return;

    return this.items[this.index];
  }

  public get prev() {
    if (this.isEmpty || this.index === null) return;

    switch (this.mode) {
      case QueueMode.Off:
        if (this.isFirst) return;
        return this.items[this.index - 1];

      case QueueMode.All:
      case QueueMode.Single:
        return this.items[(this.length + this.index - 1) % this.length];
    }
  }

  public get next() {
    if (this.isEmpty || this.index === null) return;

    switch (this.mode) {
      case QueueMode.Off:
        if (this.isLast) return;
        return this.items[this.index + 1];

      case QueueMode.All:
      case QueueMode.Single:
        return this.items[(this.index + 1) % this.length];
    }
  }

  public add = async (audios: TAudioInfo[] | TAudioInfo) => {
    if (!Array.isArray(audios)) audios = [audios];

    this.items.push(...audios);

    logger.debug(
      `[QueueManager<${this.guildId}>] Add ${audios.length} items\n${audios.map((audio) => audio.title).inspect()}`,
    );

    await this.write();
  };

  public clear = async (target: "all" | "before" | "after" | "current") => {
    if (this.isEmpty) return;

    logger.debug(`[QueueManager<${this.guildId}>] Clear (${target})`);

    switch (target) {
      case "all":
        this.items = [];
        this.index = null;
        break;

      case "before":
        if (this.isFirst || this.index === null) return;
        this.items = this.items.slice(this.index);
        this.index = 0;
        break;

      case "after":
        if (this.isLast || this.index === null) return;
        this.items = this.items.slice(0, this.index + 1);
        break;

      case "current":
        if (this.index === null) return;
        this.items.splice(this.index, 1);
        this.index = Math.max(0, this.index - 1);
        break;
    }

    await this.write();
  };

  public skip = async (reversed = false) => {
    if (this.isEmpty) return;

    logger.debug(
      `[QueueManager<${this.guildId}>] ${reversed ? "Skip (reversed)" : "Skip"}`,
    );

    if (reversed) {
      switch (this.mode) {
        case QueueMode.Off:
          if (this.isFirst || this.index === null) return;
          --this.index;
          break;

        case QueueMode.All:
        case QueueMode.Single:
          if (this.isFirst || this.index === null) {
            this.index = this.length - 1;
          } else {
            --this.index;
          }
          break;
      }
    } else {
      switch (this.mode) {
        case QueueMode.Off:
          if (this.isLast || this.index === null) return;
          ++this.index;
          break;

        case QueueMode.All:
        case QueueMode.Single:
          if (this.isLast || this.index === null) {
            this.index = 0;
          } else {
            ++this.index;
          }
          break;
      }
    }

    await this.write();
  };

  public getNext = async () => {
    if (this.isEmpty) return;

    switch (this.mode) {
      case QueueMode.Off:
        if (this.isLast) return;
        if (this.index === null) {
          this.index = 0;
        } else {
          ++this.index;
        }
        break;

      case QueueMode.All:
        if (this.index === null) {
          this.index = 0;
        } else {
          this.index = (this.index + 1) % this.length;
        }
        break;

      case QueueMode.Single:
        return this.now;
    }

    await this.write();
    return this.now;
  };

  private readonly read = async () => {
    logger.debug(`[QueueManager<${this.guildId}>] Read config`);

    try {
      const data = await JSON.read<{
        mode: QueueMode;
        index: number | null;
        items: TAudioInfo[];
      }>(`configs/${this.guildId}/queue.json`);
      if (!data) return;

      this.mode = data.mode;
      this.items = data.items;
      this.index = data.index;

      if (this.index) --this.index;
    } catch (error) {
      logger.error(
        `[QueueManager<${this.guildId}>]\n${(error as Error).stack}`,
      );
    }
  };

  private readonly write = async () => {
    logger.debug(`[QueueManager<${this.guildId}>] Write config`);

    try {
      const data = { mode: this.mode, index: this.index, items: this.items };
      await JSON.write(`configs/${this.guildId}/queue.json`, data);
    } catch (error) {
      logger.error(
        `[QueueManager<${this.guildId}>]\n${(error as Error).stack}`,
      );
    }
  };
}

export enum QueueMode {
  Off,
  All,
  Single,
}
