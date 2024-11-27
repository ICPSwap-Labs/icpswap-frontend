import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Box, Typography, makeStyles } from "components/Mui";
import {
  parseTokenAmount,
  toSignificant,
  formatDollarAmount,
  formatDollarTokenPrice,
  formatAmount,
  BigNumber,
} from "@icpswap/utils";
import { useTokenInfo } from "hooks/token/index";
import { Trans } from "@lingui/macro";
import { NoData, LoadingRow, TextButton, TokenImage, TokenStandardLabel } from "components/index";
import { TokenListMetadata } from "@icpswap/candid";
import { TOKEN_STANDARD } from "@icpswap/constants";
import { useTokenTotalHolder, useTokensFromList, useTokenSupply, useInfoToken } from "@icpswap/hooks";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useICPPrice } from "store/global/hooks";
import { Header, HeaderCell, TableRow, BodyCell, Flex, Proportion } from "@icpswap/ui";

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

  const infoToken = useInfoToken(token.canisterId);
  const icpPrice = useICPPrice();

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{index + 1}</BodyCell>
      <Flex
        fullWidth
        align="center"
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
      </Flex>
      <Flex vertical gap="6px 0" align="flex-start">
        <BodyCell sx={{ width: "100%" }} align="right">
          {infoToken ? formatDollarTokenPrice({ num: infoToken.priceUSD }) : "--"}
        </BodyCell>
        <BodyCell sub sx={{ width: "100%" }} align="right">
          {infoToken && icpPrice
            ? `${toSignificant(new BigNumber(infoToken.priceUSD).dividedBy(icpPrice).toNumber(), 8)} ICP`
            : "--"}
        </BodyCell>
      </Flex>
      <BodyCell align="right">
        <Proportion value={infoToken?.priceUSDChange} fontWeight={400} />
      </BodyCell>
      <Flex vertical gap="6px 0" align="flex-start">
        <BodyCell align="right" sx={{ width: "100%" }}>
          {infoToken && icpPrice && supply && tokenInfo
            ? formatDollarAmount(
                new BigNumber(infoToken.priceUSD).multipliedBy(parseTokenAmount(supply, tokenInfo.decimals)).toNumber(),
              )
            : "--"}
        </BodyCell>
        <BodyCell sub align="right" sx={{ width: "100%" }}>
          {infoToken && icpPrice && supply && tokenInfo
            ? `${formatAmount(
                new BigNumber(infoToken.priceUSD)
                  .multipliedBy(parseTokenAmount(supply, tokenInfo.decimals))
                  .dividedBy(icpPrice)
                  .toNumber(),
              )} ICP`
            : "--"}
        </BodyCell>
      </Flex>
      <BodyCell align="right">
        {holderCount || holderCount === BigInt(0) ? new BigNumber(String(holderCount)).toFormat() : "--"}
      </BodyCell>
    </TableRow>
  );
}

export function Tokens() {
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
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
        <Trans>Token List</Trans>
      </Typography>

      <Box sx={{ width: "100%", overflow: "auto", margin: "24px 0 0 0" }}>
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
            <Trans>Price Change</Trans>
          </HeaderCell>
          <HeaderCell>
            <Trans>FDV</Trans>
          </HeaderCell>
          <HeaderCell>
            <Trans>Holders</Trans>
          </HeaderCell>
        </Header>
        {list?.map((token, index) => <TokenListItem key={index} index={index} token={token} />)}
        {list?.length === 0 && !loading ? <NoData /> : null}
        {loading ? (
          <Box sx={{ padding: "16px" }}>
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
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
