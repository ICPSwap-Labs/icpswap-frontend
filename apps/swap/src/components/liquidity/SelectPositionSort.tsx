import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { t } from "@lingui/macro";
import { PositionSort } from "types/swap";
import { Typography } from "@mui/material";

type MenuProps = { label: string; value: PositionSort };

const menus: MenuProps[] = [
  { label: t`Default`, value: PositionSort.Default },
  { label: t`Position value`, value: PositionSort.PositionValue },
  { label: t`Uncollected fees`, value: PositionSort.FeesValue },
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
