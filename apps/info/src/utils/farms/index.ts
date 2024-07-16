import BigNumber from "bignumber.js";
import { t } from "@lingui/macro";
import { getFarmState } from "@icpswap/hooks";
import type { StakingPoolControllerPoolInfo, FarmInfo } from "@icpswap/types";

export const POOL_STATUS_COLORS = {
  NOT_STARTED: "#5669DC",
  LIVE: "#54C081",
  FINISHED: "#8492C4",
  CLOSED: "#8492C4",
};

export function getFarmPoolStatus(pool: FarmInfo | undefined) {
  if (!pool) return undefined;

  const state = getFarmState(pool);

  let statusText = "";
  let statusClassName = "";

  if (state === "NOT_STARTED") {
    statusText = t`Unstart`;
    statusClassName = "upcoming";
  } else if (state === "LIVE") {
    statusText = t`Live`;
    statusClassName = "ongoing";
  } else if (state === "FINISHED") {
    statusText = t`Finished`;
    statusClassName = "finished";
  } else if (state === "CLOSED") {
    statusText = "Closure";
    statusClassName = "closure";
  }

  return {
    statusText,
    status: state,
    statusClassName,
  };
}

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
