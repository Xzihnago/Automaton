import chatInputCommand from "./chatInputCommand";

const player: ISlashCommand<"cached"> = {
  chatInputCommand,
};

export default player;
