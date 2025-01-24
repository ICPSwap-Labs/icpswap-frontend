import { useContext, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { LoadingRow } from "@icpswap/ui";
import type { Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { SwapContext } from "components/swap/index";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { TokenInformation } from "./TokenInformation";

export function PoolTokensInformation() {
  const theme = useTheme();
  const { inputToken, outputToken, poolId } = useContext(SwapContext);

  const [token, setToken] = useState<Token | Null>(null);
  const [token0, setToken0] = useState<Token | Null>(null);
  const [token1, setToken1] = useState<Token | Null>(null);

  useEffect(() => {
    if (inputToken && outputToken) {
      const sorted = inputToken.sortsBefore(outputToken);

      const token0 = sorted ? inputToken : outputToken;
      const token1 = sorted ? outputToken : inputToken;

      setToken(token0);
      setToken0(token0);
      setToken1(token1);
    }
  }, [inputToken, outputToken]);

  return (
    <SwapProCardWrapper padding={token0 && token1 && token ? "0px" : "16px"}>
      {token0 && token1 && token ? (
        <Box sx={{ padding: "16px 0 0 0" }}>
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
              {[token0, token1].map((element) => (
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
                  onClick={() => setToken(element)}
                >
                  <Typography color="text.primary">{element.symbol}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

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
