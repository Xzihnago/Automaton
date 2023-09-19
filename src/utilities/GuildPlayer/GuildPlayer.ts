import type { Guild, VoiceBasedChannel } from "discord.js";
import {
  type AudioPlayer,
  AudioPlayerStatus,
  type AudioResource,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";

import AudioProvider from "utilities/AudioProvider";
import { QueueManager } from "./QueueManager";
import { PanelManager } from "./PanelManager";
import { EPanelMode, ERepeatMode } from "./enum";

export class GuildPlayer {
  public readonly ERepeatMode = ERepeatMode;
  public readonly EPanelMode = EPanelMode;

  public readonly guild: Guild;
  public readonly guildId: string;
  public readonly player: AudioPlayer;
  public readonly queue: QueueManager;
  public readonly panel: PanelManager;

  private _resource: AudioResource | null;

  public constructor(guild: Guild) {
    logger.debug(`[GuildPlayer] (${guild.id}) Initialize`);

    this.guild = guild;
    this.guildId = guild.id;
    this.player = createAudioPlayer();
    this.player.on(AudioPlayerStatus.Idle, this.playNext as () => void);

    this.queue = new QueueManager(guild);
    this.panel = new PanelManager(this);

    this._resource = null;
  }

  public get resource() {
    return this._resource;
  }

  public get connection() {
    return getVoiceConnection(this.guildId);
  }

  public join = (voiceChannel: VoiceBasedChannel) => {
    logger.debug(`[GuildPlayer] (${this.guildId}) Join voice`);

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    }).subscribe(this.player);
  };

  public leave = () => {
    logger.debug(`[GuildPlayer] (${this.guildId}) Leave voice`);
    this.connection?.destroy();
  };

  public remove = (target: "after" | "all" | "before" | "current") => {
    void this.queue.remove(target);

    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (target) {
      case "all":
      case "current":
        this.player.stop();
    }
  };

  public stop = () => {
    void this.queue.clear();

    logger.debug(`[GuildPlayer] (${this.guildId}) Stop audio`);
    this.player.stop();
    this._resource = null;
  };

  public pause = () => {
    logger.debug(`[GuildPlayer] (${this.guildId}) Pause audio`);
    this.player.pause();
  };

  public resume = async () => {
    if (this.player.isPlaying() || this.queue.isEmpty) return;

    logger.debug(`[GuildPlayer] (${this.guildId}) Resume audio`);
    this.connection?.subscribe(this.player);

    if (this.player.isPaused()) {
      this.player.unpause();
    } else if (this.resource) {
      this.player.play(this.resource);
    } else {
      await this.playNext();
    }
  };

  public previous = async () => {
    await this.queue.skip(true);

    if (this.queue.now && this.connect()) await this.play(this.queue.now);
  };

  public next = async () => {
    await this.queue.skip();

    if (this.queue.now && this.connect()) await this.play(this.queue.now);
  };

  private readonly connect = () => {
    if (this.connection?.subscribe(this.player)) return true;

    logger.debug(`[GuildPlayer] (${this.guildId}) No voice connection`);
    return false;
  };

  private readonly playNext = async () => {
    if (!this.connect()) return;

    // Get next audio
    const nextAudio = await this.queue.getNext();

    // Return if no audio in queue
    if (!nextAudio) {
      if (this.queue.isLast) {
        logger.debug(`[GuildPlayer] (${this.guildId}) No audio in queue`);
        this.panel.disable();
        this._resource = null;
      }
      return;
    }

    // Stream next audio
    await this.play(nextAudio);
  };

  private readonly play = async (ainfo: TAudioInfo) => {
    logger.debug(`[GuildPlayer] (${this.guildId}) Play audio ("${ainfo.title}")`);

    const audioStream = await AudioProvider.stream(ainfo.url);
    const probeInfo = await demuxProbe(audioStream);

    if (ainfo.isLive) {
      this._resource = createAudioResource(probeInfo.stream, { inputType: probeInfo.type, inlineVolume: true });
      this._resource.volume?.setVolume(1);
    } else {
      this._resource = createAudioResource(probeInfo.stream, { inputType: probeInfo.type });
    }

    this.player.play(this._resource);
  };
}
