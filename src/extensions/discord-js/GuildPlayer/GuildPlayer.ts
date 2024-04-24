import { type Guild } from "discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  getVoiceConnection,
  type AudioPlayer,
  type AudioResource,
} from "@discordjs/voice";
import AudioProvider from "utilities/AudioProvider";
import { QueueManager, QueueMode } from "./QueueManager";
import { PanelManager, PanelMode } from "./PanelManager";

export class GuildPlayer {
  public readonly QueueMode = QueueMode;
  public readonly PanelMode = PanelMode;

  public readonly guild: Guild;
  public readonly player: AudioPlayer;
  public readonly queue: QueueManager;
  public readonly panel: PanelManager;

  public resource: AudioResource | null;

  public constructor(guild: Guild) {
    logger.debug(`[GuildPlayer<${guild.id}>] Initialize`);

    this.guild = guild;
    this.player = createAudioPlayer().on(
      AudioPlayerStatus.Idle,
      this.playNext as never,
    );
    this.queue = new QueueManager(guild);
    this.panel = new PanelManager(guild);

    this.resource = null;
  }

  public get guildId() {
    return this.guild.id;
  }

  public get connection() {
    return getVoiceConnection(this.guildId);
  }

  public get duration() {
    return this.resource?.playbackDuration;
  }

  public clear = async (target: "all" | "before" | "after" | "current") => {
    await this.queue.clear(target);

    switch (target) {
      case "all":
      case "current":
        logger.debug(`[GuildPlayer<${this.guildId}>] Stop`);
        this.player.stop();
    }
  };

  public pause = () => {
    logger.debug(`[GuildPlayer<${this.guildId}>] Pause`);
    this.player.pause();
  };

  public resume = async () => {
    if (
      this.player.isPlaying() ||
      this.queue.isEmpty ||
      !this.connection?.subscribe(this.player)
    )
      return;

    logger.debug(`[GuildPlayer<${this.guildId}>] Resume`);
    if (this.player.isPaused()) {
      this.player.unpause();
    } else if (this.resource) {
      this.player.play(this.resource);
    } else {
      await this.playNext();
    }
  };

  public prev = async () => {
    await this.queue.skip(true);
    if (this.queue.now && this.connection?.subscribe(this.player)) {
      await this.play(this.queue.now);
    }
  };

  public next = async () => {
    await this.queue.skip();
    if (this.queue.now && this.connection?.subscribe(this.player)) {
      await this.play(this.queue.now);
    }
  };

  private play = async (ainfo: TAudioInfo) => {
    logger.debug(`[GuildPlayer<${this.guildId}>] Play ("${ainfo.title}")`);

    const stream = await AudioProvider.stream(ainfo.url);
    const probeInfo = await demuxProbe(stream);

    if (ainfo.isLive) {
      this.resource = createAudioResource(probeInfo.stream, {
        inputType: probeInfo.type,
        inlineVolume: true,
      });
      this.resource.volume?.setVolume(1);
    } else {
      this.resource = createAudioResource(probeInfo.stream, {
        inputType: probeInfo.type,
      });
    }

    this.player.play(this.resource);
  };

  private playNext = async () => {
    if (!this.connection?.subscribe(this.player)) return;

    const aInfo = await this.queue.getNext();

    if (!aInfo) {
      if (this.queue.isLast) {
        logger.debug(`[GuildPlayer<${this.guildId}>] No audio in queue`);
        this.panel.disable();
      }
      this.resource = null;
      return;
    }

    await this.play(aInfo);
  };
}
