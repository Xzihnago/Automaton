interface TAudioInfo {
  url: string;
  title: string;
  duration: number;
  date: string;
  author: {
    name: string;
    url: string;
  };
  thumbnail: {
    url: string;
    width: number;
  };
  isLive: boolean;
}
