import { useEffect, useState } from "react";
import { Box, Checkbox, Typography } from "@mui/material";

import { Tooltip } from "./Tooltip";

export interface OnlyTokenListProps {
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}

export function OnlyTokenList({ checked: _checked, onChange }: OnlyTokenListProps) {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    if (onChange) onChange(!checked);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setChecked(checked);
    if (onChange) onChange(checked);
  };

  useEffect(() => {
    if (_checked !== undefined) {
      setChecked(_checked);
    }
  }, [_checked]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 5px" }}>
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "0 5px" }} onClick={handleClick}>
        <Checkbox
          sx={{ "&.MuiCheckbox-root": { padding: 0 } }}
          size="small"
          onChange={(event: any, checked: boolean) => handleCheckboxChange(checked)}
          checked={checked}
        />

        <Typography color="text.primary" sx={{ userSelect: "none" }}>
          Display Only Tokens in Tokenlist
        </Typography>
      </Box>

      <Tooltip
        tips={
          <Box>
            <Typography color="#111936" fontSize="12px" lineHeight="16px">
              In the decentralized world, anyone can create a token and add liquidity, using any name and logo. This
              includes the creation of fake versions of existing tokens and tokens that claim to represent projects that
              don't have an official token.
            </Typography>

            <Typography color="#111936" mt="10px" fontSize="12px" lineHeight="16px">
              Such risks are inherent in decentralized. If you decide to invest in these tokens, there is a possibility
              of losing your assets. It is essential to "Do Your Own Research" (DYOR) before making any investment
              decisions.
            </Typography>
          </Box>
        }
      />
    </Box>
  );
}
