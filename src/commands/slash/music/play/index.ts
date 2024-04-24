import chatInputCommand from "./chatInputCommand";

const play: ISlashCommand<"cached"> = {
  chatInputCommand,
};

export default play;
