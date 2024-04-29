import dedent from "dedent";
import { EmbedBuilder, inlineCode, type Guild, type Message } from "discord.js";
import i18n from "./i18n";

export class PanelManager {
  private _mode: PanelMode;
  private _task: NodeJS.Timeout | null;
  public message: Message | null;

  constructor(public readonly guild: Guild) {
    this._mode = PanelMode.Audio;
    this._task = null;
    this.message = null;
  }

  public get guildId() {
    return this.guild.id;
  }

  public get locale() {
    return this.guild.preferredLocale;
  }

  public get player() {
    return this.guild.player;
  }

  public get queue() {
    return this.player.queue;
  }

  public get mode() {
    return this._mode;
  }
  public set mode(value: PanelMode) {
    logger.debug(`[PanelManager<${this.guildId}>] Mode(${PanelMode[value]})`);
    this._mode = value;
  }

  public get isEnable() {
    return Boolean(this._task);
  }

  public disable = () => {
    if (!this.isEnable) return;

    logger.debug(`[PanelManager<${this.guildId}>] Disable`);
    clearInterval(this._task as never);
    this._task = null;
    this.message = null;
  };

  public enable = async (message?: Message) => {
    if (message && message.id !== this.message?.id) {
      void this.message?.delete();
      this.message = message;
    }

    await this.update(true);

    if (this.isEnable) return;

    logger.debug(`[PanelManager<${this.guildId}>] Enable`);
    this._task = setInterval(this.update as () => void, 1000);
  };

  public update = async (immediate = false) => {
    if (!this.message) return;

    switch (this.mode) {
      case PanelMode.Audio:
        if (!this.queue.now || !this.player.resource) return;

        // 5 seconds interval for live audio or audio duration more than 1 minutes
        if (
          !immediate &&
          (this.queue.now.duration > 60 || this.queue.now.isLive) &&
          Math.floor(this.player.resource.playbackDuration / 1000) % 5
        )
          return;

        await this.updateInfoEmbed();
        return;

      case PanelMode.Queue:
        if (!immediate) return;
        await this.updateQueueEmbed();
        return;
    }
  };

  private readonly updateInfoEmbed = async () => {
    if (!this.message || !this.queue.now) return;

    const now = this.queue.now;
    const prev = this.queue.prev;
    const next = this.queue.next;

    const duration = Math.floor((this.player.duration ?? 0) / 1000);
    const progressBar = makeProgressBar(
      now.duration,
      duration,
      Math.min(20, Math.floor(now.thumbnail.width / 20)),
    );

    const playMode = `${i18n.Repeat[this.locale]} : ${[i18n.Off[this.locale], i18n.All[this.locale], i18n.One[this.locale]][this.queue.mode]}`;
    const queueIndex = `${i18n.Queue[this.locale]} : ${(this.queue.index ?? 0) + 1} / ${this.queue.length}`;

    const embed = new EmbedBuilder()
      .setColor(this.message.member?.displayColor ?? 0)
      .setTitle(now.title)
      .setURL(now.url)
      .setDescription(
        `${inlineCode(duration.toTimeString())} ${progressBar} ${inlineCode(now.duration.toTimeString())}`,
      )
      .setImage(now.thumbnail.url)
      .addFields(
        {
          name: i18n.Channel[this.locale],
          value: `[${now.author.name}](${now.author.url})`,
          inline: true,
        },
        {
          name: i18n.UploadDate[this.locale],
          value: now.date,
          inline: true,
        },
        {
          name: i18n.Previous[this.locale],
          value: prev ? `[${prev.title}](${prev.url})` : i18n.None[this.locale],
          inline: false,
        },
        {
          name: i18n.Next[this.locale],
          value: next ? `[${next.title}](${next.url})` : i18n.None[this.locale],
          inline: false,
        },
      )
      .setFooter({ text: `${playMode}\n${queueIndex}` });

    await this.message.edit({
      embeds: [embed],
    });
  };

  private readonly updateQueueEmbed = async () => {
    if (!this.message || this.queue.index === null) return;
    const index = this.queue.index;

    const embed = new EmbedBuilder()
      .setColor(this.message.member?.displayColor ?? 0)
      .setTitle(i18n.Queue[this.locale]);

    this.queue.items
      .slice(Math.max(0, index - 3), index + 4)
      .forEach((ainfo, i) =>
        embed.addFields({
          name:
            this.queue.index === index + i - 3
              ? i18n.NowPlaying[this.locale]
              : `No. ${index + i - 2}`,
          value: dedent`
            [${ainfo.title}](${ainfo.url})
            ${i18n.Duration[this.locale]} - ${inlineCode(ainfo.duration.toTimeString())}
            ${i18n.Channel[this.locale]} - [${ainfo.author.name}](${ainfo.author.url})
          `,
        }),
      );

    await this.message.edit({ embeds: [embed] });
  };
}

export enum PanelMode {
  Audio,
  Queue,
}

const makeProgressBar = (total: number, current: number, length: number) => {
  const line = "\u25ac"; // ▬
  const slider = "\ud83d\udd18"; // 🔘
  const progress = Math.min(Math.round((length * current) / total), length);
  return line.repeat(progress) + slider + line.repeat(length - progress);
};
