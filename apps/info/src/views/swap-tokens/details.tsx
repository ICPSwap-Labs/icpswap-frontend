import { Typography, Box, Grid, Button } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { Wrapper, Breadcrumbs, TextButton, TokenImage, MainCard } from "ui-component/index";
import { Trans } from "@lingui/macro";
import { formatDollarAmount, mockALinkAndOpen } from "@icpswap/utils";
import { useParsedQueryString, useTokenLatestTVL } from "@icpswap/hooks";
import { useToken } from "hooks/info/useToken";
import { useTokenInfo } from "hooks/token/index";
import { GridAutoRows, Proportion, TokenCharts } from "@icpswap/ui";
import TokenPools from "ui-component/analytic/TokenPools";
import TokenTransactions from "ui-component/analytic/TokenTransactions";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { swapLink, addLiquidityLink } from "utils/index";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

import { TokenPrices } from "./components/TokenPrice";

export default function TokenDetails() {
  const { canisterId } = useParams<{ canisterId: string }>();

  const { path, page } = useParsedQueryString() as { path: string | undefined; page: string | undefined };

  const token = useToken(canisterId);
  const { result: tokenInfo } = useTokenInfo(token?.address);
  const { result: tokenTVL } = useTokenLatestTVL(canisterId);

  const history = useHistory();
  const [openTips] = useTips();

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const handleToSwap = () => {
    mockALinkAndOpen(swapLink(canisterId), "to_swap");
  };

  const handleToAddLiquidity = () => {
    mockALinkAndOpen(addLiquidityLink(canisterId), "to_liquidity");
  };

  const handleToTokenDetails = () => {
    history.push(`/token/details/${canisterId}`);
  };

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink={path ? atob(path) : "/swap"}
        prevLabel={page ? atob(page) : <Trans>Swap Tokens</Trans>}
        currentLabel={<Trans>Details</Trans>}
      />

      <Box mt="20px">
        <Grid container alignItems="center">
          <TokenImage logo={tokenInfo?.logo} size="24px" tokenId={tokenInfo?.canisterId} />

          <Typography fontSize="20px" fontWeight="500" color="text.primary" sx={{ margin: "0 0 0 10px" }}>
            {token?.name}
          </Typography>

          <Typography fontSize="20px" fontWeight="500" sx={{ margin: "0 0 0 6px" }}>
            ({token?.symbol})
          </Typography>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Grid container alignItems="center">
              <TextButton
                to={`/token/details/${canisterId}`}
                sx={{
                  margin: "0 0 0 6px",
                }}
              >
                {canisterId}
              </TextButton>

              <Box sx={{ width: "4px" }} />
              <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
            </Grid>
          </Box>
        </Grid>
      </Box>

      <Grid
        container
        alignItems="flex-end"
        mt="16px"
        sx={{
          "@media (max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px 0",
          },
        }}
      >
        <Box>
          <Grid container alignItems="center">
            <Typography
              color="text.primary"
              sx={{
                fontSize: "36px",
                fontWeight: 500,
                margin: "0 10px 0 0",
                lineHeight: "0.8",
              }}
            >
              {formatDollarAmount(token?.priceUSD, 4)}
            </Typography>

            <Typography component="div" sx={{ display: "flex" }}>
              (<Proportion value={token?.priceUSDChange} />)
            </Typography>
          </Grid>
        </Box>

        <Grid item xs>
          <Grid container justifyContent="flex-end" sx={{ gap: "0 10px" }}>
            <Button variant="contained" className="secondary" onClick={handleToTokenDetails}>
              Token Details
            </Button>
            <Button variant="contained" className="secondary" onClick={handleToAddLiquidity}>
              Add Liquidity
            </Button>
            <Button variant="contained" onClick={handleToSwap}>
              Swap
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "1em",
          marginTop: "32px",

          "@media screen and (max-width: 840px)": {
            gridTemplateColumns: "1fr",
            gap: "1em",
          },
        }}
      >
        <MainCard level={2}>
          <GridAutoRows gap="24px">
            <GridAutoRows gap="4px">
              <Typography>
                <Trans>TVL</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(tokenTVL?.tvlUSD)}
              </Typography>

              <Proportion value={tokenTVL?.tvlUSDChange} />
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Volume 24H</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(token?.volumeUSD)}
              </Typography>
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Volume 7D</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(token?.volumeUSD7d)}
              </Typography>
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Fee 24H</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {token?.volumeUSD ? formatDollarAmount((token.volumeUSD * 3) / 1000) : "--"}
              </Typography>
            </GridAutoRows>
          </GridAutoRows>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <TokenPrices tokenInfo={tokenInfo} />
          </Box>
        </MainCard>

        <TokenCharts canisterId={canisterId} volume={token?.volumeUSD} />
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2}>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <TokenPools canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2}>
          <Typography variant="h3">
            <Trans>Transactions</Trans>
          </Typography>

          <Box mt="20px">
            <TokenTransactions canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
