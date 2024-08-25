import BigNumber from "bignumber.js";
import { t } from "@lingui/macro";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";

export const POOL_STATUS_COLORS = {
  NOT_STARTED: "#5669DC",
  LIVE: "#54C081",
  FINISHED: "#8492C4",
  CLOSED: "#8492C4",
};

export function getTokenPoolStatus(pool: StakingPoolControllerPoolInfo | undefined) {
  if (!pool) return undefined;

  let statusText = "";
  let statusClassName = "";
  let status = "";

  if (new BigNumber(Number(pool.startTime)).multipliedBy(1000).isGreaterThan(new Date().getTime())) {
    statusText = t`Unstart`;
    statusClassName = "upcoming";
    status = "NOT_STARTED";
  } else if (new BigNumber(Number(pool.bonusEndTime)).multipliedBy(1000).isLessThan(new Date().getTime())) {
    statusText = t`Finished`;
    statusClassName = "finished";
    status = "FINISHED";
  } else {
    statusText = t`Live`;
    statusClassName = "ongoing";
    status = "LIVE";
  }

  return {
    statusText,
    status,
    statusClassName,
  };
}
