import { BigNumber, nonUndefinedOrNull, percentToNum, numToPercent } from "@icpswap/utils";

const PERCENT_CLOSE_THRESHOLD = 10;

export interface OnPercentageChangeArgs {
  percentage: string;
  totalAmount: string;
}

export function onPercentageChange({ percentage, totalAmount }: OnPercentageChangeArgs) {
  const __amount = new BigNumber(percentToNum(percentage)).multipliedBy(totalAmount).toString();

  return {
    percentage,
    amount: __amount,
  };
}

interface OnXChangeArgs {
  x: number;
  width: number;
  totalAmount: string;
}

export function onXChange({ x, width, totalAmount }: OnXChangeArgs) {
  let balance_width_percent = numToPercent(new BigNumber(x).dividedBy(new BigNumber(width)));

  const closeable_percent = [25, 50, 75, 100].find((percent) => {
    return new BigNumber(percent)
      .minus(percentToNum(balance_width_percent) * 100)
      .abs()
      .isLessThanOrEqualTo(PERCENT_CLOSE_THRESHOLD);
  });

  if (nonUndefinedOrNull(closeable_percent)) {
    balance_width_percent = `${closeable_percent}%`;
  }

  return onPercentageChange({
    percentage: balance_width_percent,
    totalAmount,
  });
}

interface onAmountChangeProps {
  amount: string;
  totalAmount: string;
}

export function onAmountChange({ amount, totalAmount }: onAmountChangeProps) {
  const percentage = numToPercent(new BigNumber(amount).dividedBy(new BigNumber(totalAmount)).toString());

  return onPercentageChange({
    percentage,
    totalAmount,
  });
}
