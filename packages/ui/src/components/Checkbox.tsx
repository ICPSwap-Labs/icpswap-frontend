import { Box } from "@mui/material";
import { useCallback } from "react";
import { Check } from "react-feather";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  background?: string;
  borderColor?: string;
}

export function Checkbox({ checked, background = "#ffffff", borderColor = "#D3625B", onCheckedChange }: CheckboxProps) {
  const handleClick = useCallback(() => {
    onCheckedChange(!checked);
  }, [checked, onCheckedChange]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        background,
        borderRadius: "4px",
        border: `1px solid ${borderColor}`,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {checked ? <Check size={14} strokeWidth="3px" style={{ color: borderColor }} /> : null}
    </Box>
  );
}
