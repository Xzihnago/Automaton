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

  // Player
  SearchResults: {
    [Locale.EnglishUS]: "Search results",
    [Locale.ChineseTW]: "搜尋結果",
  },
  PlaylistDiscovered: {
    [Locale.EnglishUS]: "Playlist discovered",
    [Locale.ChineseTW]: "發現播放清單",
  },
  AudioAdded: {
    [Locale.EnglishUS]: "Added",
    [Locale.ChineseTW]: "已加入",
  },
  ToQueue: {
    [Locale.EnglishUS]: "to queue",
    [Locale.ChineseTW]: "至佇列",
  },
  Channel: {
    [Locale.EnglishUS]: "Channel",
    [Locale.ChineseTW]: "頻道",
  },
  Duration: {
    [Locale.EnglishUS]: "Duration",
    [Locale.ChineseTW]: "時長",
  },

  // Text
  Confirm: {
    [Locale.EnglishUS]: "Confirm",
    [Locale.ChineseTW]: "確認",
  },
  Ignore: {
    [Locale.EnglishUS]: "Ignore",
    [Locale.ChineseTW]: "忽略",
  },
});

export default i18n;
