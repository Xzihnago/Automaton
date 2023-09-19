import chatInputCommand from "./chatInputCommand";

const voice: ISlashCommand<"cached"> = {
  chatInputCommand,
};

export default voice;
