import { useContext, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { LoadingRow } from "@icpswap/ui";
import { SwapContext } from "components/swap/index";
import { ICP } from "@icpswap/tokens";
import { isUndefinedOrNull } from "@icpswap/utils";
import { SwapProCardWrapper } from "./SwapProWrapper";
import { TokenInformation } from "./TokenInformation";

export function PoolTokensInformation() {
  const theme = useTheme();
  const { inputToken, outputToken, poolId } = useContext(SwapContext);

  const [inverted, setInverted] = useState(false);

  const tokensShowInformation = useMemo(() => {
    if (!inputToken || !outputToken) return [];
    const tokens = [inputToken, outputToken].filter((token) => token.address !== ICP.address);
    return tokens;
  }, [inputToken, outputToken]);

  const token = useMemo(() => {
    if (isUndefinedOrNull(inputToken) || isUndefinedOrNull(outputToken)) return undefined;
    if (tokensShowInformation.length === 1) return tokensShowInformation[0];
    return inverted ? inputToken : outputToken;
  }, [inputToken, outputToken, inverted, tokensShowInformation]);

  return (
    <SwapProCardWrapper padding={inputToken && outputToken && token ? "0px" : "16px"}>
      {token ? (
        <Box sx={{ padding: "16px 0 0 0" }}>
          {tokensShowInformation.length === 2 ? (
            <Box sx={{ padding: "0 16px" }}>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  background: theme.palette.background.level2,
                  border: `1px solid ${theme.palette.background.level4}`,
                  padding: "2px",
                  display: "flex",
                }}
              >
                {tokensShowInformation.map((element) => (
                  <Box
                    key={element.address}
                    sx={{
                      flex: "50%",
                      background: token.address === element.address ? theme.palette.background.level1 : "none",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setInverted(!inverted)}
                  >
                    <Typography color="text.primary">{element.symbol}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}

          <TokenInformation token={token} poolId={poolId} />
        </Box>
      ) : (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      )}
    </SwapProCardWrapper>
  );
}
