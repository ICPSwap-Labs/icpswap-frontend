import numbro from "numbro";

import { BigNumber } from "./bignumber";
import { toSignificant, toSignificantWithGroupSeparator } from "./toSignificant";
import { nonNullArgs } from "./isNullArgs";

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | string | undefined, digits = 3, ab?: number) => {
  const _num = num;
  if (_num === 0 || _num === "0") return "$0.00";
  if (!_num) return "-";

  if (new BigNumber(_num).isLessThan(1)) {
    return `$${toSignificant(_num, digits)}`;
  }

  if (new BigNumber(_num).isLessThan(0.01)) {
    if (ab && new BigNumber(_num).isLessThan(ab)) return `<$${ab}`;
    return `$${toSignificant(_num, digits)}`;
  }

  return numbro(_num).formatCurrency({
    average: true,
    mantissa: Number(_num) > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};

// using a currency library here in case we want to add more in future
export const formatDollarAmountV1 = ({
  num,
  digits = 3,
  ab,
}: {
  num: number | string | undefined;
  digits?: number;
  ab?: number;
}) => {
  const _num = num;
  if (_num === 0 || _num === "0") return "$0.00";
  if (!_num) return "-";

  if (nonNullArgs(ab) && new BigNumber(_num).isLessThan(ab)) {
    return `<$${ab}`;
  }

  if (new BigNumber(_num).isLessThan(1)) {
    return `$${toSignificant(_num, digits)}`;
  }

  return `$${new BigNumber(new BigNumber(_num).toFixed(2)).toFormat()}`;
};

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | string | undefined, digits = 2) => {
  if (num === 0 || num === "0") return "0";

  if (!num) return "-";

  if (new BigNumber(num).isLessThan(0.0001)) {
    return "<0.0001";
  }

  if (new BigNumber(num).isLessThan(0.001)) {
    return toSignificantWithGroupSeparator(num, 4);
  }

  return numbro(num).format({
    average: true,
    mantissa: Number(num) > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};

export function percentToNum(val: string) {
  return new BigNumber(val.replace("%", "")).dividedBy(100).toNumber();
}

export function numToPercent(num: string | number | BigNumber, digits?: number) {
  return digits || digits === 0
    ? `${new BigNumber(num).multipliedBy(100).toFixed(digits)}%`
    : `${new BigNumber(num).multipliedBy(100).toString()}%`;
}
