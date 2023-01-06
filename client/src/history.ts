import { createHashHistory, createBrowserHistory } from "history";
import { isIpfsBasename } from "./utils/ipfs";

export default isIpfsBasename() ? createHashHistory() : createBrowserHistory();
