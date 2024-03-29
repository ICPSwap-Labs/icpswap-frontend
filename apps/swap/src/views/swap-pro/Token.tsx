import React, { useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useTokenInfo } from "hooks/token";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { Theme } from "@mui/material/styles";
import { shorten } from "@icpswap/utils";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

interface CardProps {
  padding?: "12px" | "8px";
  title?: string;
  children: React.ReactNode;
}

function Card({ title, padding = "8px", children }: CardProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ background: theme.palette.background.level1, borderRadius: "8px", padding }}>
      {title ? <Typography sx={{ margin: "0 0 8px 0" }}>{title}</Typography> : null}
      {children}
    </Box>
  );
}

export default function Token() {
  const { tokenId } = useContext(SwapProContext);

  const { result: tokenInfo } = useTokenInfo(tokenId);

  return (
    <SwapProCardWrapper>
      <Typography color="text.primary" fontWeight={600}>
        <Trans>Token Name</Trans>
        <Typography component="span" color="text.theme_secondary" fontWeight={600}>
          {tokenInfo?.name}
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
            {tokenInfo ? shorten(tokenInfo.canisterId, 5) : "--"}
          </Typography>
          <CopyIcon />
        </Typography>

        <Typography
          color="text.primary"
          fontSize="12px"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}
        >
          <Trans>Pool</Trans>
          <Typography component="span" color="text.theme_secondary" fontSize="12px">
            {tokenInfo?.name}
          </Typography>
          <CopyIcon />
        </Typography>
      </Box>

      <Box sx={{ margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: "8px 0" }}>
        <Card title={t`Price swap with ICP`}>1234</Card>
        <Card>1234</Card>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <Card title={t`Total Supply`}>1234</Card>
          <Card title={t`Transfer Fee`}>1234</Card>
          <Card title={t`Market Cap (USD)`}>1234</Card>
          <Card title={t`Market Cap (ICP)`}>1234</Card>
          <Card title={t`Volume 24H`}>1234</Card>
          <Card title={t`Volume 7D`}>1234</Card>
          <Card title={t`Decimals`}>1234</Card>
          <Card title={t`Holders`}>1234</Card>
        </Box>
      </Box>

      {/* <Box sx={{ margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: "8px 0" }}></Box> */}
    </SwapProCardWrapper>
  );
}
