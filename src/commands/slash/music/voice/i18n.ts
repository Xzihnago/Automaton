import { Locale } from "discord.js";

const i18n = i18nWrapper({
  CannotJoinVoiceChannel: {
    [Locale.EnglishUS]: "Cannot join voice channel",
    [Locale.ChineseTW]: "無法加入語音頻道",
  },
  CannotLeaveVoiceChannel: {
    [Locale.EnglishUS]: "Cannot leave voice channel",
    [Locale.ChineseTW]: "無法離開語音頻道",
  },
  JoinedVoice: {
    [Locale.EnglishUS]: "Joined voice channel",
    [Locale.ChineseTW]: "已加入語音頻道",
  },
  LeftVoice: {
    [Locale.EnglishUS]: "Left voice channel",
    [Locale.ChineseTW]: "已離開語音頻道",
  },
});

export default i18n;
