import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { SortBalanceEnum } from "types/index";
import i18n from "i18n/index";

const menus: { label: string; value: SortBalanceEnum }[] = [
  { label: i18n.t("common.all.balance"), value: SortBalanceEnum.ALL },
  { label: i18n.t("common.hide.$10.balance"), value: SortBalanceEnum.TEN },
  { label: i18n.t("common.hide.$1.balance"), value: SortBalanceEnum.ONE },
  { label: i18n.t("common.hide.$0.balance"), value: SortBalanceEnum.ZERO },
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
