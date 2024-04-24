import { Locale } from "discord.js";

const i18n = i18nWrapper({
  // Panel components
  SelectMode: {
    [Locale.EnglishUS]: "Select mode",
    [Locale.ChineseTW]: "選擇模式",
  },
  SelectOperation: {
    [Locale.EnglishUS]: "Select operation",
    [Locale.ChineseTW]: "選擇操作",
  },
  ButtonClose: {
    [Locale.EnglishUS]: "Close",
    [Locale.ChineseTW]: "關閉",
  },
  ButtonLeave: {
    [Locale.EnglishUS]: "Leave",
    [Locale.ChineseTW]: "離開",
  },
  ButtonJoin: {
    [Locale.EnglishUS]: "Join",
    [Locale.ChineseTW]: "加入",
  },
  ButtonQueue: {
    [Locale.EnglishUS]: "Queue",
    [Locale.ChineseTW]: "佇列",
  },
  ButtonPrevious: {
    [Locale.EnglishUS]: "Previous",
    [Locale.ChineseTW]: "上一首",
  },
  ButtonPause: {
    [Locale.EnglishUS]: "Pause",
    [Locale.ChineseTW]: "暫停",
  },
  ButtonPlay: {
    [Locale.EnglishUS]: "Play",
    [Locale.ChineseTW]: "播放",
  },
  ButtonNext: {
    [Locale.EnglishUS]: "Next",
    [Locale.ChineseTW]: "下一首",
  },

  // Panel select
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

  Clear: {
    [Locale.EnglishUS]: "Clear",
    [Locale.ChineseTW]: "清空",
  },
  Before: {
    [Locale.EnglishUS]: "Before",
    [Locale.ChineseTW]: "已播放",
  },
  After: {
    [Locale.EnglishUS]: "After",
    [Locale.ChineseTW]: "未播放",
  },
  Current: {
    [Locale.EnglishUS]: "Current",
    [Locale.ChineseTW]: "當前",
  },
});

export default i18n;
