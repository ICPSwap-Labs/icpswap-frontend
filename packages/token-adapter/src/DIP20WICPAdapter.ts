import { dip20 } from "@icpswap/actor";
import { DIP20TokenAdapter } from "./DIP20Adapter";

export class DIP20WICPTokenAdapter extends DIP20TokenAdapter {}

export const DIP20WICPAdapter = new DIP20WICPTokenAdapter({
  actor: dip20,
});
