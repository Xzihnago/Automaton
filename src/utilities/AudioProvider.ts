import { createReadStream, createWriteStream } from "fs";
import { access, mkdir, rename } from "fs/promises";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import ytsr, { type Video } from "ytsr";

const isPlayable = (url: string) => ytdl.validateURL(url);
const hasPlaylist = (url: string) => ytpl.validateID(url);

const search = async (query: string): Promise<TAudioInfo[]> => {
  logger.info(`[AudioProvider] Searching ("${query}")`);

  return (await ytsr(`"${query}"`, { limit: 10 })).items
    .filter((item): item is Video => item.type === "video")
    .map((item) => ({
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
  logger.info(`[AudioProvider] Fetch playlist ("${url}")`);

  return (await ytpl(url)).items.map((item) => ({
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
  logger.info(`[AudioProvider] Fetch video info (${url})`);

  const vInfo = await ytdl.getInfo(url);
  const vDetails = vInfo.videoDetails;
  const thumbnail = vDetails.thumbnails.pop();

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
    dlChunkSize: 0,
    filter: "audio",
    quality: [93, 251, 250, 249, 140], // HLS(H.264 360p + AAC 128kbps), Opus <=160kbps, Opus ~70kbps, Opus ~50kbps, AAC 128kbps
  };

  logger.info(`[AudioProvider] Fetch video stream (${url})`);

  const vInfo = await ytdl.getInfo(url);

  if (process.env.CACHE && !vInfo.videoDetails.isLiveContent) {
    const cachePath = `cache/${vInfo.videoDetails.videoId}.webm`;

    return await access(cachePath)
      .then(() => {
        logger.debug("[AudioProvider] Found cached resource");
        return createReadStream(cachePath);
      })
      .catch(() => {
        logger.debug("[AudioProvider] Caching resource");
        const readable = ytdl.downloadFromInfo(vInfo, options);

        const tempPath = `cache/${Date.now()}`;
        readable.pipe(createWriteStream(tempPath)).once("close", () => {
          void rename(tempPath, cachePath);
        });

        return readable;
      });
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

// Make cache folder if cache or debug is enabled
if (process.env.CACHE ?? process.env.DEBUG) {
  await mkdir("cache", { recursive: true });
}

export default AudioProvider;
