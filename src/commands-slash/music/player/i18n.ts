import { Locale } from "discord.js";

const i18n = i18nWrapper({
  // Exceptions
  MissingPermissions: {
    [Locale.EnglishUS]: "Missing permissions",
    [Locale.ChineseTW]: "缺少權限",
  },
  MemberNotInVoiceChannel: {
    [Locale.EnglishUS]: "You are not in voice channel",
    [Locale.ChineseTW]: "成員需在語音頻道內",
  },

  // Audio
  AudioStop: {
    [Locale.EnglishUS]: "Audio stopped",
    [Locale.ChineseTW]: "已停止播放",
  },

  AudioPause: {
    [Locale.EnglishUS]: "Audio paused",
    [Locale.ChineseTW]: "已暫停播放",
  },

  AudioResume: {
    [Locale.EnglishUS]: "Audio resumed",
    [Locale.ChineseTW]: "已繼續播放",
  },

  AudioPrevious: {
    [Locale.EnglishUS]: "Play previous audio",
    [Locale.ChineseTW]: "播放上一首",
  },

  AudioNext: {
    [Locale.EnglishUS]: "Play next audio",
    [Locale.ChineseTW]: "播放下一首",
  },

  // Queue
  QueueEmpty: {
    [Locale.EnglishUS]: "Queue is empty",
    [Locale.ChineseTW]: "佇列為空",
  },
});

export default i18n;
