import { Box, Typography, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTokenIsInTokenList } from "store/global/hooks";
import { ReactComponent as TokenListDarkIcon } from "assets/icons/token-list-dark.svg";

export interface TokenListIdentifyingProps {
  tokenId: string | undefined;
}

export function TokenListIdentifying({ tokenId }: TokenListIdentifyingProps) {
  const theme = useTheme() as Theme;
  const inTokenList = useTokenIsInTokenList(tokenId);

  return inTokenList ? (
    <Box
      sx={{
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "0 10px",
        borderRadius: "60px",
        background: theme.colors.successDark,
      }}
    >
      <TokenListDarkIcon />
      <Typography sx={{ fontSize: "12px", color: "#1A223F" }}>Token List</Typography>
    </Box>
  ) : null;
}
