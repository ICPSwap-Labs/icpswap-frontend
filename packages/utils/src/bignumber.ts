import BigNumber from "bignumber.js";

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

/** Re-export of `bignumber.js` with global rounding set to `ROUND_DOWN`. */
export { BigNumber };
