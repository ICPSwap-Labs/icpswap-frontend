import BigNumber from "bignumber.js";
import { t } from "@lingui/macro";

import type { StakingPoolControllerPoolInfo, FarmInfo } from "@icpswap/types";

export const POOL_STATUS = {
  ONGOING: "ongoing",
  UPCOMING: "upcoming",
  FINISHED: "finished",
  Closure: "closure",
};

export const POOL_STATUS_COLORS = {
  [POOL_STATUS.UPCOMING]: "#5669DC",
  [POOL_STATUS.ONGOING]: "#54C081",
  [POOL_STATUS.FINISHED]: "#8492C4",
  [POOL_STATUS.Closure]: "#8492C4",
};

export function getFarmPoolStatus(pool: FarmInfo | undefined) {
  if (!pool) return undefined;

  if (pool.status === "Closure") {
    return {
      statusText: "Closure",
      status: POOL_STATUS.Closure,
      statusClassName: "closure",
    };
  }

  let statusText = "";
  let statusClassName = "";
  let status = "";

  if (pool.status === "NOT_STARTED") {
    statusText = t`Upcoming`;
    statusClassName = "upcoming";
    status = POOL_STATUS.UPCOMING;
  } else if (pool.status === "LIVE") {
    statusText = t`Live`;
    statusClassName = "ongoing";
    status = POOL_STATUS.ONGOING;
  } else if (pool.status === "FINISHED") {
    statusText = t`Finished`;
    statusClassName = "finished";
    status = POOL_STATUS.FINISHED;
  }

  return {
    statusText,
    status,
    statusClassName,
  };
}

export function getTokenPoolStatus(pool: StakingPoolControllerPoolInfo | undefined) {
  if (!pool) return undefined;

  let statusText = "";
  let statusClassName = "";
  let status = "";

  if (new BigNumber(Number(pool.startTime)).multipliedBy(1000).isGreaterThan(new Date().getTime())) {
    statusText = t`Upcoming`;
    statusClassName = "upcoming";
    status = POOL_STATUS.UPCOMING;
  } else if (new BigNumber(Number(pool.bonusEndTime)).multipliedBy(1000).isLessThan(new Date().getTime())) {
    statusText = t`Finished`;
    statusClassName = "finished";
    status = POOL_STATUS.FINISHED;
  } else {
    statusText = t`Live`;
    statusClassName = "ongoing";
    status = POOL_STATUS.ONGOING;
  }

  return {
    statusText,
    status,
    statusClassName,
  };
}
