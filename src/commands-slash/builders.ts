import general from "./general/builders";
import music from "./music/builders";

const builders = {
  ...music,
  ...general,
};

export default builders;
