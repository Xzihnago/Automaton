type TGroupCache = [string, string];

interface TGroupInfo {
  roles: string;
  time: string;
  target: string;
  note: string;
  slot: number;

  hostId: string;
  playerMajor: string[];
  playerMinor: string[];
  deadline: Date;
  color: number | null;
}
