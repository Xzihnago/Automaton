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
  ClientNotInVoiceChannel: {
    [Locale.EnglishUS]: "Bot not in voice channel",
    [Locale.ChineseTW]: "機器人需在語音頻道內",
  },

  // Voice
  ClientJoinedVoiceChannel: {
    [Locale.EnglishUS]: "Joined voice channel",
    [Locale.ChineseTW]: "已加入語音頻道",
  },
  ClientLeftVoiceChannel: {
    [Locale.EnglishUS]: "Left voice channel",
    [Locale.ChineseTW]: "已離開語音頻道",
  },
});

export default i18n;
