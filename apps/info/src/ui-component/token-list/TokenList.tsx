import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { parseTokenAmount, toSignificant, formatDollarAmount, formatAmount } from "@icpswap/utils";
import { useTokenInfo } from "hooks/token/index";
import { Trans } from "@lingui/macro";
import { NoData, LoadingRow, TextButton, TokenImage } from "ui-component/index";
import { TokenListMetadata } from "@icpswap/candid";
import { TOKEN_STANDARD } from "@icpswap/constants";
import TokenStandardLabel from "ui-component/TokenStandardLabel";
import { useTokenTotalHolder, useTokensFromList, useTokenSupply } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useICPPrice } from "store/global/hooks";
import { makeStyles } from "@mui/styles";
import BigNumber from "bignumber.js";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "60px repeat(4, 1fr) 120px 120px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

function TokenListItem({ token, index }: { token: TokenListMetadata; index: number }) {
  const history = useHistory();
  const classes = useStyles();

  const loadTokenDetail = () => {
    history.push({ pathname: `/token/details/${token.canisterId}` });
  };

  const { result: tokenInfo } = useTokenInfo(token.canisterId.toString());
  const { result: holderCount } = useTokenTotalHolder(token?.canisterId?.toString());
  const { result: supply } = useTokenSupply(token.canisterId.toString());

  const tokenUSDPrice = useUSDPrice(token.canisterId);
  const icpPrice = useICPPrice();

  // sx={{ borderTop: "1px solid rgba(189, 200, 240, 0.082)" }}

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{index + 1}</BodyCell>
      <Grid
        container
        alignItems="center"
        sx={{
          minWidth: "120px",
          gap: "0 8px",
        }}
      >
        <TokenImage logo={tokenInfo?.logo} size="40px" tokenId={tokenInfo?.canisterId} />
        <Typography fontSize="16px" color="text.primary">
          {token?.symbol}
        </Typography>
        <TokenStandardLabel standard={token.standard as TOKEN_STANDARD} />
      </Grid>
      <Typography component="div">
        <BodyCell>
          {tokenUSDPrice && icpPrice ? formatDollarAmount(new BigNumber(tokenUSDPrice).toNumber(), 8) : "--"}
        </BodyCell>
        <BodyCell sub>
          {tokenUSDPrice && icpPrice
            ? `${toSignificant(new BigNumber(tokenUSDPrice).dividedBy(icpPrice).toNumber(), 8)} ICP`
            : "--"}
        </BodyCell>
      </Typography>
      <BodyCell>{parseTokenAmount(supply, tokenInfo?.decimals).toFormat()}</BodyCell>
      <Typography>
        <BodyCell>
          {tokenUSDPrice && icpPrice && supply && tokenInfo
            ? formatDollarAmount(
                new BigNumber(tokenUSDPrice).multipliedBy(parseTokenAmount(supply, tokenInfo.decimals)).toNumber(),
              )
            : "--"}
        </BodyCell>
        <BodyCell sub>
          {tokenUSDPrice && icpPrice && supply && tokenInfo
            ? `${formatAmount(
                new BigNumber(tokenUSDPrice)
                  .multipliedBy(parseTokenAmount(supply, tokenInfo.decimals))
                  .dividedBy(icpPrice)
                  .toNumber(),
              )} ICP`
            : "--"}
        </BodyCell>
      </Typography>
      <BodyCell>
        {holderCount || holderCount === BigInt(0) ? new BigNumber(String(holderCount)).toFormat() : "--"}
      </BodyCell>

      <TextButton onClick={loadTokenDetail}>
        <Trans>Details</Trans>
      </TextButton>
    </TableRow>
  );
}

export default function TokenList() {
  const classes = useStyles();
  const { result: tokenList, loading } = useTokensFromList();

  const list = useMemo(() => {
    if (!tokenList) return [];

    return tokenList.sort((a, b) => {
      if (a && b) {
        if (a.rank < b.rank) return -1;
        if (a.rank === b.rank) return 0;
        if (a.rank > b.rank) return 1;
      }

      return 0;
    });
  }, [tokenList]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box mt={2} sx={{ overflow: "auto" }}>
          <Header className={classes.wrapper}>
            <HeaderCell>
              <Trans>Index</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Symbol</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Price</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Total Supply</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Market Cap</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Holders</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Action</Trans>
            </HeaderCell>
          </Header>
          {list?.map((token, index) => <TokenListItem key={index} index={index} token={token} />)}
          {list?.length === 0 && !loading ? <NoData /> : null}
          {loading ? (
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
            </LoadingRow>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
}
