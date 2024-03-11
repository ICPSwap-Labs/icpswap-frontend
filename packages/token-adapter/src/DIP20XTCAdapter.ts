import { dip20 } from "@icpswap/actor";
import { DIP20TokenAdapter } from "./DIP20Adapter";

export class DIP20XTCTokenAdapter extends DIP20TokenAdapter {}

export const DIP20XTCAdapter = new DIP20XTCTokenAdapter({
  actor: dip20,
});
