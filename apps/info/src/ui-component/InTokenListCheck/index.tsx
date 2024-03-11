// @ts-nocheck
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, Checkbox, Typography, Tooltip } from "@mui/material";
import { QuestionMark } from "assets/icons/QuestionMark";

export interface InTokenListCheckProps {
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}

export default function InTokenListCheck({ checked: _checked, onChange }: InTokenListCheckProps) {
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
          <Trans>Display Only Tokens in Tokenlist</Trans>
        </Typography>
      </Box>

      <Tooltip
        enterTouchDelay={0}
        PopperProps={{
          sx: {
            "& .MuiTooltip-tooltip": {
              background: "#ffffff",
              borderRadius: "8px",
              padding: "12px 16px",
              "& .MuiTooltip-arrow": {
                color: "#ffffff",
              },
            },
          },
        }}
        title={
          <Box>
            <Typography color="text.400" fontSize="14px">
              <Trans>
                In the decentralized world, anyone can create a token and add liquidity, using any name and logo. This
                includes the creation of fake versions of existing tokens and tokens that claim to represent projects
                that don't have an official token.
              </Trans>
            </Typography>

            <Typography color="text.400" mt="10px" fontSize="14px">
              <Trans>
                Such risks are inherent in decentralized. If you decide to invest in these tokens, there is a
                possibility of losing your assets. It is essential to "Do Your Own Research" (DYOR) before making any
                investment decisions.
              </Trans>
            </Typography>
          </Box>
        }
        arrow
      >
        <Box sx={{ width: "16px", height: "16px", cursor: "pointer" }}>
          <QuestionMark />
        </Box>
      </Tooltip>
    </Box>
  );
}
