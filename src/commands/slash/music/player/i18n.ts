import { Locale } from "discord.js";

const i18n = i18nWrapper({
  CannotJoinVoiceChannel: {
    [Locale.EnglishUS]: "Cannot join voice channel",
    [Locale.ChineseTW]: "無法加入語音頻道",
  },

  AudioPause: {
    [Locale.EnglishUS]: "Audio paused",
    [Locale.ChineseTW]: "已暫停播放",
  },
  AudioResume: {
    [Locale.EnglishUS]: "Audio resumed",
    [Locale.ChineseTW]: "已繼續播放",
  },
  AudioPlay: {
    [Locale.EnglishUS]: "Play ",
    [Locale.ChineseTW]: "播放 ",
  },

  QueueEmpty: {
    [Locale.EnglishUS]: "Queue is empty",
    [Locale.ChineseTW]: "佇列為空",
  },
});

export default i18n;
