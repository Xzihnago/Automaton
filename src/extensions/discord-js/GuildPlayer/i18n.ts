import { Locale } from "discord.js";

const i18n = i18nWrapper({
  // Player embed
  Repeat: {
    [Locale.EnglishUS]: "Repeat",
    [Locale.ChineseTW]: "重複",
  },
  Off: {
    [Locale.EnglishUS]: "Off",
    [Locale.ChineseTW]: "關閉",
  },
  All: {
    [Locale.EnglishUS]: "All",
    [Locale.ChineseTW]: "所有",
  },
  One: {
    [Locale.EnglishUS]: "One",
    [Locale.ChineseTW]: "單曲",
  },
  Queue: {
    [Locale.EnglishUS]: "Queue",
    [Locale.ChineseTW]: "佇列",
  },

  Channel: {
    [Locale.EnglishUS]: "Channel",
    [Locale.ChineseTW]: "頻道",
  },
  UploadDate: {
    [Locale.EnglishUS]: "Upload date",
    [Locale.ChineseTW]: "上傳日期",
  },
  Previous: {
    [Locale.EnglishUS]: "Previous",
    [Locale.ChineseTW]: "上一首",
  },
  Next: {
    [Locale.EnglishUS]: "Next",
    [Locale.ChineseTW]: "下一首",
  },
  None: {
    [Locale.EnglishUS]: "None",
    [Locale.ChineseTW]: "無",
  },

  // Queue embed
  Duration: {
    [Locale.EnglishUS]: "Duration",
    [Locale.ChineseTW]: "時長",
  },
  NowPlaying: {
    [Locale.EnglishUS]: "Now playing",
    [Locale.ChineseTW]: "正在播放",
  },
});

export default i18n;
