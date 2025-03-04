import { Box, Typography } from "components/Mui";
import { TOKEN_STANDARD } from "constants/tokens";

export const StandardText = {
  [TOKEN_STANDARD.DIP20]: "DIP20",
  [TOKEN_STANDARD.DIP20_WICP]: "DIP20",
  [TOKEN_STANDARD.DIP20_XTC]: "DIP20",
  [TOKEN_STANDARD.EXT]: "EXT",
  [TOKEN_STANDARD.ICP]: "--",
  [TOKEN_STANDARD.ICRC1]: "ICRC-1",
  [TOKEN_STANDARD.ICRC2]: "ICRC-2",
};

export const StandardLabelBg = {
  [TOKEN_STANDARD.DIP20]: "#606AA5",
  [TOKEN_STANDARD.DIP20_WICP]: "#606AA5",
  [TOKEN_STANDARD.DIP20_XTC]: "#606AA5",
  [TOKEN_STANDARD.EXT]: "#4E9A8C",
  [TOKEN_STANDARD.ICP]: "transparent",
  [TOKEN_STANDARD.ICRC1]: "#2D54BA",
  [TOKEN_STANDARD.ICRC2]: "#2D98BA",
};

export interface TokenStandardLabelProps {
  standard: TOKEN_STANDARD | undefined | null;
  borderRadius?: string;
  height?: string;
  fontSize?: string;
  width?: string;
}

export function TokenStandardLabel({
  standard,
  height,
  fontSize = "12px",
  borderRadius = "4px",
  width,
}: TokenStandardLabelProps) {
  return (
    <Box>
      <Box
        sx={{
          width,
          minWidth: "44px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: height ?? "fit-content",
          padding: "4px",
          backgroundColor: standard ? StandardLabelBg[standard] : "",
          borderRadius,
        }}
      >
        <Typography
          sx={{
            fontSize,
            color: "text.primary",
            fontWeight: 500,
            textAlign: "center",
            // transform: fontSize === "10px" ? "scale(0.8)" : "scale(1)",
          }}
        >
          {standard ? StandardText[standard] : "--"}
        </Typography>
      </Box>
    </Box>
  );
}
