import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { t } from "@lingui/macro";

import { WalletTokenSortType } from "./types";

const menus: { label: string; value: WalletTokenSortType }[] = [
  { label: t`Highest value`, value: "High" },
  { label: t`Lowest value`, value: "Low" },
  { label: t`Default`, value: "Default" },
];

export interface SelectSortTypeProps {
  border?: boolean;
  value?: WalletTokenSortType;
  onChange?: (value: WalletTokenSortType) => void;
  filled?: boolean;
  fullHeight?: boolean;
}

export function SelectSortType({ value: sortType, onChange, border, filled, fullHeight }: SelectSortTypeProps) {
  const [value, setValue] = useState<WalletTokenSortType | null>(null);

  useEffect(() => {
    if (sortType) {
      setValue(sortType);
    }
  }, [sortType]);

  const handleValueChange = (value: WalletTokenSortType) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      menus={menus}
      menuMaxHeight="240px"
      minMenuWidth="130px"
      onChange={handleValueChange}
      value={value}
      border={border}
      filled={filled}
      fullHeight={fullHeight}
      showClean={false}
      showBackground={false}
      valueColor="text.secondary"
      panelPadding="9px 0"
    />
  );
}
