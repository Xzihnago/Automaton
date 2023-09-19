import { EmbedBuilder, type Locale, type Message } from "discord.js";
import type { AudioPlayer, AudioResource } from "@discordjs/voice";
import type { GuildPlayer } from "./GuildPlayer";
import type { QueueManager } from "./QueueManager";

import { EPanelMode } from "./enum";
import i18n from "./i18n";

const makeProgressBar = (total: number, current: number, length: number) => {
  const line = "\u25ac"; // ▬
  const slider = "\ud83d\udd18"; // 🔘
  const progress = Math.min(Math.round((length * current) / total), length);
  return line.repeat(progress) + slider + line.repeat(length - progress);
};

export class PanelManager {
  public mode: EPanelMode;
  public message: Message | null;

  public readonly guildId: string;
  public readonly locale: Locale;
  public readonly player: AudioPlayer;

  public readonly guildPlayer: GuildPlayer;
  public readonly queue: QueueManager;

  private _task: NodeJS.Timeout | undefined;

  public constructor(guildPlayer: GuildPlayer) {
    this.guildId = guildPlayer.guildId;
    this.locale = guildPlayer.guild.preferredLocale;
    this.player = guildPlayer.player;

    this.guildPlayer = guildPlayer;
    this.queue = guildPlayer.queue;

    this.mode = EPanelMode.Audio;
    this.message = null;

    this._task = setInterval(this.update as () => void, 1000);
  }

  public get isEnable() {
    return Boolean(this._task);
  }

  public enable = (message?: Message) => {
    // Delete previous panel
    if (message && message.id !== this.message?.id) {
      const oldPanel = this.message;
      this.message = message;
      void oldPanel?.delete();
    }

    void this.update(true);

    if (this.isEnable) return;

    logger.debug(`[PanelManager] (${this.guildId}) Enable update`);
    this._task = setInterval(this.update as () => void, 1000);
  };

  public disable = () => {
    if (!this.isEnable) return;

    logger.debug(`[PanelManager] (${this.guildId}) Disable update`);

    clearInterval(this._task);
    this._task = undefined;
    this.message = null;
  };

  public update = async (immediate = false) => {
    if (!this.message) return;

    switch (this.mode) {
      case EPanelMode.Audio:
        // Return if player is not playing or panel this.message not exist
        if (!(this.player.isPlaying() && this.queue.now && this.guildPlayer.resource)) return;

        // 5 seconds interval for live audio or audio duration more than 1 minutes
        if (
          !immediate &&
          (this.queue.now.duration > 60 || this.queue.now.isLive) &&
          Math.floor(this.guildPlayer.resource.playbackDuration / 1000) % 5
        )
          return;

        await this.panelInfo(this.message, this.queue, this.guildPlayer.resource);
        break;

      case EPanelMode.Queue:
        await this.panelQueue(this.message, this.queue);
        break;
    }
  };

  private readonly panelInfo = async (message: Message, queue: QueueManager, resource: AudioResource) => {
    const locale = this.locale;

    const previous = queue.previous;
    const now = queue.now;
    const next = queue.next;

    if (!now) return;

    // Embed description
    const playbackDuration = Math.floor(resource.playbackDuration / 1000);
    const currDuration = playbackDuration.toTimeString();
    const progressBar = makeProgressBar(
      now.duration,
      playbackDuration,
      Math.floor(Math.min(400, now.thumbnail.width) / 20),
    );
    const totalDuration = now.duration.toTimeString();
    const embedDescription = `\`${currDuration}\` ${progressBar} \`${totalDuration}\``;

    // Embed fields
    const embedFields = [
      { name: i18n.Channel[locale], value: `[${now.author.name}](${now.author.url})`, inline: true },
      { name: i18n.UploadDate[locale], value: now.date, inline: true },
      {
        name: i18n.Previous[locale],
        value: previous ? `[${previous.title}](${previous.url})` : i18n.None[locale],
        inline: false,
      },
      { name: i18n.Next[locale], value: next ? `[${next.title}](${next.url})` : i18n.None[locale], inline: false },
    ];

    // Embed footer
    const playMode = `${i18n.Repeat[locale]} : ${[i18n.Off[locale], i18n.All[locale], i18n.One[locale]][queue.mode]}`;
    const queueIndex = `${i18n.Queue[locale]} : ${queue.index + 1} / ${queue.size}`;
    const embedFooter = `${playMode}\n${queueIndex}`;

    const embed = new EmbedBuilder()
      .setColor(message.member?.displayColor ?? 0)
      .setTitle(now.title)
      .setURL(now.url)
      .setDescription(embedDescription)
      .setImage(now.thumbnail.url)
      .addFields(...embedFields)
      .setFooter({ text: embedFooter });

    await message.edit({ embeds: [embed] });
  };

  private readonly panelQueue = async (message: Message, queue: QueueManager) => {
    const locale = this.locale;
    const embed = new EmbedBuilder().setColor(message.member?.displayColor ?? 0).setTitle(i18n.Queue[locale]);

    for (let i = queue.index - 3; i <= queue.index + 3; ++i) {
      const ainfo = queue.items[i] as TAudioInfo | undefined;
      if (!ainfo) continue;

      embed.addFields({
        name: i === queue.index ? `${i18n.NowPlaying[locale]}` : `No. ${i + 1}`,
        value: [
          `[${ainfo.title}](${ainfo.url})`,
          `${i18n.Duration[locale]} - \`${ainfo.duration.toTimeString()}\``,
          `${i18n.Channel[locale]} - [${ainfo.author.name}](${ainfo.author.url})`,
        ].join("\n"),
        inline: false,
      });
    }

    await message.edit({ embeds: [embed] });
  };
}
