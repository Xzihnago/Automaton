import initialize from "./initialize";
import chatInputCommand from "./chatInputCommand";

const squad: ISlashCommand<"cached"> = {
  initialize,
  chatInputCommand,
};

export default squad;
