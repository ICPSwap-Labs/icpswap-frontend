import React, { useEffect, ReactNode, useContext, useMemo, useState, useCallback } from "react";
import { SwapProCardWrapper } from "components/swap/pro";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { TokenPoolPrice } from "components/TokenPoolPrice";
import { TokenImage } from "components/index";
import { Box, BoxProps, Typography, useTheme } from "components/Mui";
import { BigNumber, formatDollarAmount, formatAmount, parseTokenAmount } from "@icpswap/utils";
import { Flex, Tooltip } from "@icpswap/ui";
import type { Null } from "@icpswap/types";
import { ArrowUpRight } from "react-feather";
import { Token } from "@icpswap/swap-sdk";
import { useInfoToken } from "@icpswap/hooks";
import { SwapContext } from "components/swap";
import { useTranslation } from "react-i18next";

import { LiquidityLocks } from "./LiquidityLocks";

interface TokenTvlProps {
  token: Token | Null;
  poolId: string | Null;
  onUpdateTvl: (tvl: string | undefined) => void;
}

function TokenTvl({ token, poolId, onUpdateTvl }: TokenTvlProps) {
  const { result: tokenBalance } = useTokenBalance(token?.address, poolId);
  const infoToken = useInfoToken(token?.address);

  const tokenPrice = useMemo(() => infoToken?.priceUSD, [infoToken]);

  const tokenUsdTvl = useMemo(() => {
    if (!tokenBalance || !tokenPrice || !token) return undefined;
    return new BigNumber(tokenPrice).multipliedBy(parseTokenAmount(tokenBalance, token.decimals)).toString();
  }, [tokenBalance, tokenPrice, token]);

  useEffect(() => {
    if (tokenUsdTvl) {
      onUpdateTvl(tokenUsdTvl);
    }
  }, [tokenUsdTvl]);

  return (
    <Box sx={{ display: "flex", gap: "0 6px", alignItems: "center" }}>
      <TokenImage logo={token?.logo} tokenId={token?.address} size="18px" />
      <Typography color="text.primary" fontSize="12px">
        {tokenBalance ? formatAmount(parseTokenAmount(tokenBalance, token?.decimals).toNumber()) : "--"}{" "}
        {token?.symbol ?? "--"} ({formatDollarAmount(tokenUsdTvl)})
      </Typography>
    </Box>
  );
}

interface CardProps {
  padding?: "12px" | "8px";
  title?: ReactNode;
  titleArrow?: boolean;
  children: React.ReactNode;
  fontSize?: "14px" | "12px";
  tips?: ReactNode;
  wrapperSx?: BoxProps["sx"];
}

function Card({ title, titleArrow, padding = "8px", fontSize = "14px", tips, children, wrapperSx }: CardProps) {
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.level1, borderRadius: "8px", padding, ...wrapperSx }}>
      {title ? (
        <Flex fullWidth justify="center" gap="0 4px" sx={{ margin: "0 0 8px 0" }}>
          <Typography sx={{ fontSize }}>{title}</Typography>
          {titleArrow ? <ArrowUpRight size={14} color={theme.colors.secondaryMain} /> : null}
          {tips ? <Tooltip iconSize="12px" tips={tips} /> : null}
        </Flex>
      ) : null}
      {children}
    </Box>
  );
}

interface TvlValue {
  tvl0: string | Null;
  tvl1: string | Null;
}

export default function TokenUI() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { poolId, inputToken, outputToken } = useContext(SwapContext);

  const [token0, setToken0] = useState<Token | Null>(null);
  const [token1, setToken1] = useState<Token | Null>(null);

  useEffect(() => {
    if (inputToken && outputToken) {
      const sorted = inputToken.sortsBefore(outputToken);

      const token0 = sorted ? inputToken : outputToken;
      const token1 = sorted ? outputToken : inputToken;

      setToken0(token0);
      setToken1(token1);
    }
  }, [inputToken, outputToken]);

  const infoToken0 = useInfoToken(token0?.address);
  const infoToken1 = useInfoToken(token1?.address);

  const [tvlValue, setTvlValue] = useState<TvlValue>({
    tvl0: null,
    tvl1: null,
  });

  const totalTVL = useMemo(() => {
    if (!tvlValue.tvl0 || !tvlValue.tvl1) return undefined;
    return formatDollarAmount(new BigNumber(tvlValue.tvl0).plus(tvlValue.tvl1).toString());
  }, [tvlValue]);

  const handleUpdateTvl = useCallback((key: keyof TvlValue, tvl: string | undefined) => {
    setTvlValue((prevState) => ({ ...prevState, [key]: tvl }));
  }, []);

  return (
    <SwapProCardWrapper padding="0px">
      <Box sx={{ padding: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px 0" }}>
          {token0 && token1 ? (
            <Card title={t("common.last.price")} fontSize="12px">
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px 0", padding: "0 0 0 4px" }}>
                <TokenPoolPrice
                  tokenA={token0}
                  tokenB={token1}
                  priceA={infoToken0?.priceUSD}
                  priceB={infoToken1?.priceUSD}
                  background="none"
                />
                <TokenPoolPrice
                  tokenA={token1}
                  tokenB={token0}
                  priceA={infoToken1?.priceUSD}
                  priceB={infoToken0?.priceUSD}
                  background="none"
                />
              </Box>
            </Card>
          ) : null}

          <Card>
            <Box sx={{ display: "flex", gap: "0 16px" }}>
              <Box sx={{ padding: "0 0 0 8px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography align="center" fontSize="12px" sx={{ transform: "scale(0.9)" }}>
                  {t("common.tvl")}
                </Typography>
                <Typography color="text.primary" align="center" sx={{ margin: "5px 0 0 0" }} fontSize="12px">
                  {totalTVL ?? "--"}
                </Typography>
              </Box>
              <Box sx={{ width: "1px", height: "48px", background: theme.palette.background.level4 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px 0" }}>
                <TokenTvl
                  token={token0}
                  poolId={poolId}
                  onUpdateTvl={(tvl: string | undefined) => handleUpdateTvl("tvl0", tvl)}
                />
                <TokenTvl
                  token={token1}
                  poolId={poolId}
                  onUpdateTvl={(tvl: string | undefined) => handleUpdateTvl("tvl1", tvl)}
                />
              </Box>
            </Box>
          </Card>

          <LiquidityLocks poolId={poolId} />
        </Box>
      </Box>
    </SwapProCardWrapper>
  );
}
