/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createReadStream, createWriteStream } from "fs";
import { access, mkdir, rename } from "fs/promises";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import ytsr, { type Video } from "ytsr";

// Make cache folder if cache or debug is enabled
if (process.env.CACHE ?? process.env.DEBUG) await mkdir("cache", { recursive: true });

const isPlayable = (url: string) => ytdl.validateURL(url);
const hasPlaylist = (url: string) => ytpl.validateID(url);

const search = async (query: string): Promise<TAudioInfo[]> => {
  logger.info(`[AudioProvider] Searching ("${query}")`);

  const res = await ytsr(`"${query}"`, { limit: 10 });

  // Cache search result in debug mode
  if (process.env.DEBUG) {
    logger.debug("[AudioProvider] Caching search result");
    void JSON.save("cache/search.json", res, true);
  }

  const videos = res.items.filter((item) => item.type === "video") as Video[];

  return videos.map((item) => ({
    url: item.url,
    title: item.title,
    duration: item.duration?.toSeconds() ?? 0,
    date: item.uploadedAt ?? "No data (fetch from search)",
    author: {
      name: item.author?.name ?? "No data (fetch from search)",
      url: item.author?.url ?? "No data (fetch from search)",
    },
    thumbnail: {
      url: item.bestThumbnail.url ?? "",
      width: item.bestThumbnail.width || 400,
    },
    isLive: item.isLive,
  }));
};

const playlist = async (url: string): Promise<TAudioInfo[]> => {
  logger.info(`[AudioProvider] Get playlist ("${url}")`);

  const res = await ytpl(url);

  // Cache playlist info in debug mode
  if (process.env.DEBUG) {
    logger.debug("[AudioProvider] Caching playlist info");
    void JSON.save("cache/playlist.json", res, true);
  }

  return res.items.map((item) => ({
    url: item.url,
    title: item.title,
    duration: Number(item.durationSec),
    date: "No data (fetch from playlist)",
    author: {
      name: item.author.name,
      url: item.author.url,
    },
    thumbnail: {
      url: item.bestThumbnail.url ?? "",
      width: item.bestThumbnail.width || 400,
    },
    isLive: item.isLive,
  }));
};

const info = async (url: string): Promise<TAudioInfo> => {
  logger.info(`[AudioProvider] Get video info (${url})`);

  const vInfo = await ytdl.getInfo(url);

  // Cache video info in debug mode
  if (process.env.DEBUG) {
    logger.debug("[AudioProvider] Caching video info");
    void JSON.save("cache/vinfo.json", vInfo, true);
  }

  const vDetails = vInfo.videoDetails;
  const thumbnail = vDetails.thumbnails.pop(); // Get thumbnail with highest resolution

  return {
    url: vDetails.video_url,
    title: vDetails.title,
    duration: Number(vDetails.lengthSeconds),
    date: vDetails.uploadDate,
    author: {
      name: vDetails.author.name,
      url: vDetails.author.channel_url,
    },
    thumbnail: {
      url: thumbnail?.url ?? "",
      width: thumbnail?.width ?? 400,
    },
    isLive: vDetails.isLiveContent,
  };
};

const stream = async (url: string) => {
  const options: ytdl.downloadOptions = {
    liveBuffer: 1 << 30,
    highWaterMark: 1 << 30,
    dlChunkSize: 0, // Disabling chunking is recommended in discord bot
    filter: "audio",
    quality: [93, 251, 250, 249, 140], // HLS(H.264 360p + AAC 128kbps), Opus <=160kbps, Opus ~70kbps, Opus ~50kbps, AAC 128kbps
  };

  logger.info(`[AudioProvider] Streaming (${url})`);

  const vInfo = await ytdl.getInfo(url);

  if (process.env.CACHE && !vInfo.videoDetails.isLiveContent) {
    const cachePath = `cache/${vInfo.videoDetails.videoId}.webm`;
    try {
      await access(cachePath);
      logger.debug("[AudioProvider] Found cached resource");

      return createReadStream(cachePath);
    } catch {
      logger.debug("[AudioProvider] Caching resource");

      const tempPath = `cache/${Date.now()}`;
      const stream_ = ytdl.downloadFromInfo(vInfo, options);

      stream_.pipe(createWriteStream(tempPath)).once("close", (async () => {
        await rename(tempPath, cachePath);
      }) as () => void);

      return stream_;
    }
  }

  return ytdl.downloadFromInfo(vInfo, options);
};

const AudioProvider = {
  isPlayable,
  hasPlaylist,
  search,
  playlist,
  info,
  stream,
};

export default AudioProvider;
