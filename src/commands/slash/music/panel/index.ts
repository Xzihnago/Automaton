import chatInputCommand from "./chatInputCommand";
import messageComponent from "./messageComponent";

const panel: ISlashCommand<"cached"> = {
  chatInputCommand,
  messageComponent,
};

export default panel;
