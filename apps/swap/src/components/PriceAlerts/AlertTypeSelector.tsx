import { useEffect, useMemo, useState, ReactNode } from "react";
import { Select } from "components/Select/ForToken";
import type { IcpSwapAPITokenInfo } from "@icpswap/types";
import { useTranslation } from "react-i18next";

export interface SelectTokenProps {
  border?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  filter?: (tokenInfo: IcpSwapAPITokenInfo) => boolean;
  filled?: boolean;
  fullHeight?: boolean;
  showBackground?: boolean;
  showClean?: boolean;
  panelPadding?: string;
  defaultPanel?: ReactNode;
}

export function AlertTypeSelector({
  value: tokenId,
  onChange,
  border,
  filled,
  fullHeight,
  showBackground,
  showClean,
  panelPadding,
}: SelectTokenProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    return [
      { label: "Price rises to", value: "PriceIncrease" },
      { label: "Price drops to", value: "PriceDecrease" },
      { label: "24h increase", value: "MarginOfIncrease24H" },
      { label: "24h decrease", value: "MarginOfDecrease24H" },
    ];
  }, []);

  const handleValueChange = (value: string) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      placeholder={t("price.alerts.select.alert.type")}
      menus={menus}
      minMenuWidth="180px"
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
      border={border}
      filled={filled}
      fullHeight={fullHeight}
      showBackground={showBackground}
      showClean={showClean}
      panelPadding={panelPadding}
    />
  );
}
