import React, { useContext, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { BigNumber, shorten, formatDollarAmount, formatAmount, parseTokenAmount } from "@icpswap/utils";
import { TokenPoolPrice } from "components/TokenPoolPrice";
import { useTokenTotalHolder, useTokenSupply } from "@icpswap/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { TokenImage } from "components/index";
import { useICPPrice } from "hooks/useUSDPrice";
import type { PublicTokenOverview, TokenListMetadata } from "@icpswap/types";
import type { TokenInfo } from "types/token";
import { ChevronDown } from "react-feather";
import { Copy } from "components/Copy/icon";
import { Token } from "@icpswap/swap-sdk";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

interface TokenTvlProps {
  token: Token | undefined;
  balance: BigNumber | undefined;
  tvlUsd: string | undefined;
}

function TokenTvl({ token, balance, tvlUsd }: TokenTvlProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 6px", alignItems: "center" }}>
      <TokenImage logo={token?.logo} tokenId={token?.address} size="18px" />
      <Typography color="text.primary" fontSize="12px">
        {balance ? formatAmount(parseTokenAmount(balance, token?.decimals).toNumber()) : "--"} {token?.symbol ?? "--"} (
        {formatDollarAmount(tvlUsd)})
      </Typography>
    </Box>
  );
}

interface CardProps {
  padding?: "12px" | "8px";
  title?: string;
  children: React.ReactNode;
  fontSize?: "14px" | "12px";
}

function Card({ title, padding = "8px", fontSize = "14px", children }: CardProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ background: theme.palette.background.level1, borderRadius: "8px", padding }}>
      {title ? <Typography sx={{ margin: "0 0 8px 0", textAlign: "center", fontSize }}>{title}</Typography> : null}
      {children}
    </Box>
  );
}

export interface TokenProps {
  tokenInfo: TokenInfo | undefined;
  infoToken: PublicTokenOverview | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export default function TokenUI({ infoToken, tokenListInfo }: TokenProps) {
  const theme = useTheme() as Theme;
  const { token, tradePoolId, inputToken, outputToken, inputTokenPrice, outputTokenPrice } = useContext(SwapProContext);
  const [moreInformation, setMoreInformation] = useState(true);

  const tokenId = useMemo(() => token?.address, [token]);

  const { result: token0Balance } = useTokenBalance(inputToken?.address, tradePoolId);
  const { result: token1Balance } = useTokenBalance(outputToken?.address, tradePoolId);

  const tokenPrice = useMemo(() => {
    return token?.address === inputToken?.address ? inputTokenPrice : outputTokenPrice;
  }, [inputToken, outputToken, token]);

  const icpPrice = useICPPrice();

  const token0UsdTvl = useMemo(() => {
    if (!token0Balance || !inputTokenPrice || !inputToken) return undefined;
    return new BigNumber(inputTokenPrice).multipliedBy(parseTokenAmount(token0Balance, inputToken.decimals)).toString();
  }, [token0Balance, inputTokenPrice, inputToken]);

  const token1UsdTvl = useMemo(() => {
    if (!token1Balance || !outputTokenPrice || !outputToken) return undefined;
    return new BigNumber(outputTokenPrice)
      .multipliedBy(parseTokenAmount(token1Balance, outputToken.decimals))
      .toString();
  }, [token1Balance, outputTokenPrice, outputToken]);

  const totalTVL = useMemo(() => {
    if (!token0UsdTvl || !token1UsdTvl) return undefined;
    return formatDollarAmount(new BigNumber(token0UsdTvl).plus(token1UsdTvl).toString());
  }, [token0UsdTvl, token1UsdTvl]);

  const { result: tokenSupply } = useTokenSupply(tokenId);
  const { result: tokenHolders } = useTokenTotalHolder(tokenId);

  return (
    <SwapProCardWrapper padding="0px">
      <Box sx={{ padding: !(tokenListInfo && token && tokenListInfo.introduction) ? "16px" : "16px 16px 0 16px" }}>
        <Typography color="text.primary" fontWeight={600}>
          <Trans>Token Name</Trans>
          <Typography component="span" color="text.theme_secondary" fontWeight={600} sx={{ margin: "0 0 0 3px" }}>
            {token?.name}
          </Typography>
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", margin: "12px 0 0 0" }}>
          <Typography
            color="text.primary"
            fontSize="12px"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
          >
            <Trans>Token</Trans>
            <Typography component="span" color="text.theme_secondary" fontSize="12px">
              {token ? shorten(token.address, 5) : "--"}
            </Typography>
            <Copy content={tokenId} />
          </Typography>

          <Typography
            color="text.primary"
            fontSize="12px"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
          >
            <Trans>Pool</Trans>
            <Typography component="span" color="text.theme_secondary" fontSize="12px">
              {tradePoolId ? shorten(tradePoolId) : "--"}
            </Typography>
            <Copy content={tradePoolId} />
          </Typography>
        </Box>

        <Box sx={{ margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: "8px 0" }}>
          {inputToken && outputToken ? (
            <Card title={t`Price swap with ICP`} fontSize="12px">
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px 0", padding: "0 0 0 4px" }}>
                <TokenPoolPrice
                  tokenA={inputToken}
                  tokenB={outputToken}
                  priceA={inputTokenPrice}
                  priceB={outputTokenPrice}
                  background="none"
                />
                <TokenPoolPrice
                  tokenA={outputToken}
                  tokenB={inputToken}
                  priceA={outputTokenPrice}
                  priceB={inputTokenPrice}
                  background="none"
                />
              </Box>
            </Card>
          ) : null}

          {moreInformation ? (
            <Card>
              <Box sx={{ display: "flex", gap: "0 16px" }}>
                <Box sx={{ padding: "0 0 0 8px" }}>
                  <Typography align="center" fontSize="12px" sx={{ transform: "scale(0.9)" }}>
                    <Trans>TVL</Trans>
                  </Typography>
                  <Typography color="text.primary" align="center" sx={{ margin: "5px 0 0 0" }} fontSize="12px">
                    {totalTVL ?? "--"}
                  </Typography>
                </Box>
                <Box sx={{ width: "1px", height: "48px", background: theme.palette.background.level4 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px 0" }}>
                  <TokenTvl token={inputToken} tvlUsd={token0UsdTvl} balance={token0Balance} />
                  <TokenTvl token={outputToken} tvlUsd={token1UsdTvl} balance={token1Balance} />
                </Box>
              </Box>
            </Card>
          ) : null}

          {moreInformation ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <Card title={t`Total Supply`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {tokenSupply && token
                    ? formatAmount(parseTokenAmount(tokenSupply.toString(), token.decimals).toNumber())
                    : "--"}
                </Typography>
              </Card>
              <Card title={t`Transfer Fee`}>
                <Typography
                  color="text.primary"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                  component="div"
                >
                  {token ? parseTokenAmount(token.transFee.toString(), token.decimals).toFormat() : "--"}
                  <Typography
                    color="text.primary"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: "86px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    (
                    {tokenSupply && token && tokenPrice
                      ? formatDollarAmount(
                          parseTokenAmount(token.transFee.toString(), token.decimals)
                            .multipliedBy(tokenPrice)
                            .toString(),
                        )
                      : "--"}
                    )
                  </Typography>
                </Typography>
              </Card>
              <Card title={t`Market Cap (USD)`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {tokenSupply && token && tokenPrice
                    ? formatDollarAmount(
                        parseTokenAmount(tokenSupply.toString(), token.decimals).multipliedBy(tokenPrice).toString(),
                      )
                    : "--"}
                </Typography>
              </Card>
              <Card title={t`Market Cap (ICP)`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {tokenSupply && token && tokenPrice && icpPrice
                    ? formatAmount(
                        parseTokenAmount(tokenSupply.toString(), token.decimals)
                          .multipliedBy(tokenPrice)
                          .dividedBy(icpPrice)
                          .toString(),
                      )
                    : "--"}
                </Typography>
              </Card>
              <Card title={t`Volume 24H`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {infoToken ? formatDollarAmount(infoToken.volumeUSD) : "--"}
                </Typography>
              </Card>
              <Card title={t`Volume 7D`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {infoToken ? formatDollarAmount(infoToken.volumeUSD7d) : "--"}
                </Typography>
              </Card>
              <Card title={t`Decimals`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {token ? token.decimals : "--"}
                </Typography>
              </Card>
              <Card title={t`Holders`}>
                <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                  {tokenHolders ? tokenHolders.toString() : "--"}
                </Typography>
              </Card>
            </Box>
          ) : null}
        </Box>

        {tokenListInfo && token && tokenListInfo.introduction && moreInformation ? (
          <Box sx={{ margin: "20px 0 0 0" }}>
            <Typography sx={{ fontWeight: 600 }} color="text.primary">
              <Trans>Introduction</Trans>
            </Typography>

            <Typography
              sx={{
                margin: "8px 0 0 0",
                fontSize: "12px",
                display: "-webkit-box",
                WebkitLineClamp: moreInformation ? "none" : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Typography component="span" sx={{ margin: "0 5px 0 0", color: "text.theme_secondary", fontWeight: 600 }}>
                {token?.symbol}
              </Typography>
              {tokenListInfo.introduction}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {token ? (
        <Box
          sx={{
            margin: "12px 0 0 0",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.palette.background.level4,
            cursor: "pointer",
          }}
          onClick={() => setMoreInformation(!moreInformation)}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 500, margin: "0 3px 0 0" }}>
            {moreInformation ? <Trans>less information</Trans> : <Trans>more information </Trans>}
          </Typography>
          <ChevronDown style={{ transform: moreInformation ? "rotate(180deg)" : "rotate(0deg)" }} size="16px" />
        </Box>
      ) : null}
    </SwapProCardWrapper>
  );
}
