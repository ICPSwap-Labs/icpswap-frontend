import numbro from "numbro";

import { BigNumber } from "./bignumber";
import { toSignificant, toSignificantWithGroupSeparator } from "./toSignificant";

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | string | undefined, digits = 3, round = true, ab?: number) => {
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
    average: round,
    mantissa: Number(_num) > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
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

export function numToPercent(num: string | number | BigNumber) {
  return `${new BigNumber(num).multipliedBy(100).toString()}%`;
}
