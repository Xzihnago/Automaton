import initialize from "./initialize";
import autocomplete from "./autocomplete";
import chatInputCommand from "./chatInputCommand";
import messageComponent from "./messageComponent";

const group: ISlashCommand<"cached"> = {
  initialize,
  autocomplete,
  chatInputCommand,
  messageComponent,
};

export default group;
