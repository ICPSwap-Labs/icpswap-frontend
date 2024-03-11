import { Identity } from "types/index";
import { wrapICP } from "@icpswap/actor";

export const WICP = async (identity?: Identity) => await wrapICP(identity);
