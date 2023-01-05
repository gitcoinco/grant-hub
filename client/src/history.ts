import { createHashHistory, createBrowserHistory } from "history";
import { isIpfsBasename } from "./utils/ipfs";

const hashHistory = createHashHistory();
const browserHistory = createBrowserHistory();

export default isIpfsBasename() ? hashHistory : browserHistory;
