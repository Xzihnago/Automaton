interface TSchedule {
  name: string;
  cron: string;
  callback: () => void;
}
