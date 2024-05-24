import { useEffect, useState } from "react";
import { Select } from "components/Select/ForToken";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export const TokenStandards = [
  { label: "EXT", value: TOKEN_STANDARD.EXT },
  { label: "DIP20", value: TOKEN_STANDARD.DIP20 },
  { label: "ICRC-1", value: TOKEN_STANDARD.ICRC1 },
  { label: "ICRC-2", value: TOKEN_STANDARD.ICRC2 },
];

export interface SelectTokenStandardProps {
  border?: boolean;
  value?: TOKEN_STANDARD;
  onChange?: (standard: TOKEN_STANDARD) => void;
  filled?: boolean;
  fullHeight?: boolean;
  defaultValue?: TOKEN_STANDARD;
}

export function SelectTokenStandard({
  value: standard,
  onChange,
  border,
  filled,
  fullHeight,
  defaultValue = TOKEN_STANDARD.ICRC1,
}: SelectTokenStandardProps) {
  const [value, setValue] = useState<TOKEN_STANDARD>(defaultValue);

  useEffect(() => {
    if (standard) {
      setValue(standard);
    }
  }, [standard]);

  const handleValueChange = (value: TOKEN_STANDARD) => {
    setValue(value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      placeholder="Select a token standard"
      menus={TokenStandards}
      maxWidth={280}
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
      border={border}
      filled={filled}
      fullHeight={fullHeight}
    />
  );
}
