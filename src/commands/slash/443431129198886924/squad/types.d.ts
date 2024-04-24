type TGroupCache = [string, string];

interface ISquadData {
  roles: string;
  time: string;
  desc: string;
  note: string;
  vacancy: number;

  playerHost: string;
  playerMajor: string[];
  playerMinor: string[];
  deadline: Date;
  color: number | null;
}
