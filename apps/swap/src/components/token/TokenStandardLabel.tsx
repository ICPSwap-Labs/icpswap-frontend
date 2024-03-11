import { Box, Typography } from "@mui/material";
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

export default function TokenStandardLabel({ standard }: { standard: TOKEN_STANDARD | undefined | null }) {
  return (
    <Box>
      <Box
        sx={{
          width: "44px",
          padding: "3px 0",
          backgroundColor: !!standard ? StandardLabelBg[standard] : "",
          borderRadius: "4px",
        }}
      >
        <Typography fontSize="12px" color="#fff" fontWeight="500" align="center">
          {standard ? StandardText[standard] : "--"}
        </Typography>
      </Box>
    </Box>
  );
}
