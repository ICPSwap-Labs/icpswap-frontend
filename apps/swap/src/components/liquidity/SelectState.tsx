import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { Typography } from "components/Mui";
import { PositionFilterState } from "types/swap";
import i18n from "i18n/index";

const menus: { label: string; value: string }[] = [
  { label: i18n.t("common.default"), value: PositionFilterState.Default },
  { label: i18n.t("common.all"), value: PositionFilterState.All },
  { label: i18n.t("common.in.ranges"), value: PositionFilterState.InRanges },
  { label: i18n.t("common.out.of.ranges"), value: PositionFilterState.OutOfRanges },
  { label: i18n.t("common.closed"), value: PositionFilterState.Closed },
];

export interface SelectStateProps {
  border?: boolean;
  value?: PositionFilterState;
  onChange?: (value: PositionFilterState) => void;
  filled?: boolean;
  fullHeight?: boolean;
}

export function SelectPositionState({ value: state, onChange, border, filled, fullHeight }: SelectStateProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (state) {
      setValue(state);
    }
  }, [state]);

  const handleValueChange = (value: PositionFilterState) => {
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
      panelPadding="0"
      panel={(menu) => {
        if (!menu) return null;
        return <Typography color="text.primary">{menu.value}</Typography>;
      }}
    />
  );
}
