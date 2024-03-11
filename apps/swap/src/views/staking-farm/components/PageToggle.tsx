import { t } from "@lingui/macro";
import { STATE } from "types/staking-farm";

export type Page = {
  label: string;
  path: string;
  state: STATE;
};

export const Pages: Page[] = [
  {
    label: t`Live`,
    path: `/staking-farm?state=${STATE.LIVE}`,
    state: STATE.LIVE,
  },
  {
    label: t`Unstart`,
    path: `/staking-farm?state=${STATE.NOT_STARTED}`,
    state: STATE.NOT_STARTED,
  },
  {
    label: t`Finished`,
    path: `/staking-farm?state=${STATE.FINISHED}`,
    state: STATE.FINISHED,
  },
  {
    label: t`Closure`,
    path: `/staking-farm?state=${STATE.CLOSED}`,
    state: STATE.CLOSED,
  },
];
