import { useState, useCallback } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, Checkbox } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface ImpactProps {
  onCheckChange: (checked: boolean) => void;
  ui?: "pro";
  showImpact: boolean;
}

export const Impact = ({ showImpact, onCheckChange, ui }: ImpactProps) => {
  const { t } = useTranslation();
  const [impactChecked, setImpactChecked] = useState(false);

  const handleCheck = useCallback((check: boolean) => {
    setImpactChecked(check);
    onCheckChange(check);
  }, []);

  return showImpact ? (
    <Box
      sx={{
        padding: ui === "pro" ? "10px" : "16px",
        background: "rgba(211, 98, 91, 0.15)",
        borderRadius: "16px",
      }}
    >
      <Flex gap="0 8px" align="flex-start">
        <Flex>
          <Checkbox checked={impactChecked} onCheckedChange={handleCheck} />
        </Flex>

        <Typography
          style={{
            color: "#D3625B",
            lineHeight: "15px",
            fontSize: "12px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => handleCheck(!impactChecked)}
        >
          {t("swap.price.impact.high.descriptions")}
        </Typography>
      </Flex>
    </Box>
  ) : null;
};
