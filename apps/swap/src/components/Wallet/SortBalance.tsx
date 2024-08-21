import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { t } from "@lingui/macro";
import { SortBalanceEnum } from "types/index";

const menus: { label: string; value: SortBalanceEnum }[] = [
  { label: t`All Balance`, value: SortBalanceEnum.ALL },
  { label: t`Hide <$10 Balance`, value: SortBalanceEnum.TEN },
  { label: t`Hide <$1 Balance`, value: SortBalanceEnum.ONE },
  { label: t`Hide $0 Balance`, value: SortBalanceEnum.ZERO },
];

export interface SortBalanceProps {
  border?: boolean;
  value?: SortBalanceEnum;
  onChange?: (value: SortBalanceEnum) => void;
  filled?: boolean;
  fullHeight?: boolean;
}

export function SortBalance({ value, onChange, border, filled, fullHeight }: SortBalanceProps) {
  const [__value, setValue] = useState<SortBalanceEnum | null>(null);

  useEffect(() => {
    if (value) {
      setValue(value);
    }
  }, [value]);

  const handleValueChange = (value: SortBalanceEnum) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      menus={menus}
      menuMaxHeight="240px"
      minMenuWidth="180px"
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
