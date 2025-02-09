import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { PositionSort } from "types/swap";
import { Typography } from "components/Mui";
import i18n from "i18n/index";

type MenuProps = { label: string; value: PositionSort };

const menus: MenuProps[] = [
  { label: i18n.t("common.default"), value: PositionSort.Default },
  { label: i18n.t("common.position.value"), value: PositionSort.PositionValue },
  { label: i18n.t("common.uncollected.fees"), value: PositionSort.FeesValue },
];

export interface SelectSortProps {
  border?: boolean;
  value?: PositionSort;
  onChange?: (value: PositionSort) => void;
  filled?: boolean;
  fullHeight?: boolean;
}

export function SelectPositionsSort({ value: state, onChange, border, filled, fullHeight }: SelectSortProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (state) {
      setValue(state);
    }
  }, [state]);

  const handleValueChange = (value: PositionSort) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      menus={menus}
      menuMaxHeight="240px"
      minMenuWidth="160px"
      onChange={handleValueChange}
      value={value}
      border={border}
      filled={filled}
      fullHeight={fullHeight}
      showClean={false}
      showBackground={false}
      valueColor="text.secondary"
      panelPadding="0"
      panel={(menu) => {
        if (!menu) return null;
        return <Typography color="text.primary">{menu.value}</Typography>;
      }}
    />
  );
}
