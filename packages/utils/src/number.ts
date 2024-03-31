import numbro from "numbro";
import { toSignificant } from "./toSignificant";

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | string | undefined, digits = 2, round = true) => {
  const _num = num;
  if (_num === 0 || _num === "0") return "$0.00";
  if (!_num) return "-";

  if (Number(_num) < 0.01) {
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

  if (Number(num) < 0.001) {
    return "<0.001";
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
