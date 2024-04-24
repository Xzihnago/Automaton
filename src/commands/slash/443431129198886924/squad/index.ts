import initialize from "./initialize";
import chatInputCommand from "./chatInputCommand";
import messageComponent from "./messageComponent";

const squad: ISlashCommand<"cached"> = {
  initialize,
  chatInputCommand,
  messageComponent,
};

export default squad;
