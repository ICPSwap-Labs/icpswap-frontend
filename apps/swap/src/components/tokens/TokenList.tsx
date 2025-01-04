import { useMemo, useState, useCallback } from "react";
import { Box, Typography, makeStyles } from "components/Mui";
import {
  parseTokenAmount,
  formatDollarAmount,
  formatDollarTokenPrice,
  BigNumber,
  nonNullArgs,
  isNullArgs,
  formatIcpAmount,
} from "@icpswap/utils";
import { useTokenInfo } from "hooks/token/index";
import { Trans } from "@lingui/macro";
import { NoData, LoadingRow, TokenImage, TokenStandardLabel } from "components/index";
import { TokenListMetadata } from "@icpswap/candid";
import { TOKEN_STANDARD } from "@icpswap/types";
import { useTokensFromList, useTokenSupply, useInfoToken, useExplorerTokenDetails } from "@icpswap/hooks";
import { useICPPrice } from "store/global/hooks";
import { Header, HeaderCell, TableRow, BodyCell, Flex, Proportion, Link } from "@icpswap/ui";
import InfiniteScroll from "react-infinite-scroll-component";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "60px repeat(4, 1fr) 240px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1152px",
    },
  };
});

function TokenListItem({ token, index }: { token: TokenListMetadata; index: number }) {
  const classes = useStyles();

  const { result: tokenInfo } = useTokenInfo(token.canisterId);
  const { result: supply } = useTokenSupply(token.canisterId);
  const { result: icExplorerTokenDetails } = useExplorerTokenDetails(token.canisterId);

  const infoToken = useInfoToken(token.canisterId);
  const icpPrice = useICPPrice();

  return (
    <Link to={`/info-tokens/details/${token.canisterId}`}>
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
            {infoToken ? formatDollarTokenPrice(infoToken.priceUSD) : "--"}
          </BodyCell>
          <BodyCell sub sx={{ width: "100%" }} align="right">
            {infoToken && icpPrice
              ? `${formatIcpAmount(new BigNumber(infoToken.priceUSD).dividedBy(icpPrice).toNumber())} ICP`
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
                  new BigNumber(infoToken.priceUSD)
                    .multipliedBy(parseTokenAmount(supply, tokenInfo.decimals))
                    .toNumber(),
                )
              : "--"}
          </BodyCell>
          <BodyCell sub align="right" sx={{ width: "100%" }}>
            {infoToken && icpPrice && supply && tokenInfo
              ? `${formatIcpAmount(
                  new BigNumber(infoToken.priceUSD)
                    .multipliedBy(parseTokenAmount(supply, tokenInfo.decimals))
                    .dividedBy(icpPrice)
                    .toNumber(),
                )} ICP`
              : "--"}
          </BodyCell>
        </Flex>
        <BodyCell align="right">
          {nonNullArgs(icExplorerTokenDetails) && nonNullArgs(icExplorerTokenDetails.holderAmount)
            ? new BigNumber(icExplorerTokenDetails.holderAmount).toFormat()
            : "--"}
        </BodyCell>
      </TableRow>
    </Link>
  );
}

const PAGE_SIZE = 10;
const START_PAGE = 1;

export function Tokens() {
  const classes = useStyles();
  const [page, setPage] = useState(START_PAGE);
  const { result: allTokens } = useTokensFromList();

  const sortedTokens = useMemo(() => {
    if (!allTokens) return null;

    return allTokens.sort((a, b) => {
      if (a && b) {
        if (a.rank < b.rank) return -1;
        if (a.rank === b.rank) return 0;
        if (a.rank > b.rank) return 1;
      }

      return 0;
    });
  }, [allTokens]);

  const slicedTokens = useMemo(() => {
    if (!sortedTokens) return undefined;

    return sortedTokens.slice(0, PAGE_SIZE * page);
  }, [sortedTokens, page]);

  const hasMore = useMemo(() => {
    if (!slicedTokens || !allTokens) return false;
    return slicedTokens.length !== allTokens.length;
  }, [slicedTokens, allTokens]);

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
        <Trans>Token List</Trans>
      </Typography>

      <Box sx={{ width: "100%", overflow: "auto", margin: "24px 0 0 0" }}>
        <InfiniteScroll
          dataLength={slicedTokens?.length ?? 0}
          next={handleScrollNext}
          hasMore={hasMore}
          loader={
            <Box sx={{ padding: "24px" }}>
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            </Box>
          }
        >
          {slicedTokens && slicedTokens.length > 0 ? (
            <>
              <Header className={classes.wrapper}>
                <HeaderCell>
                  <Trans>Index</Trans>
                </HeaderCell>
                <HeaderCell>
                  <Trans>Symbol</Trans>
                </HeaderCell>
                <HeaderCell align="right">
                  <Trans>Price</Trans>
                </HeaderCell>
                <HeaderCell align="right">
                  <Trans>Price Change</Trans>
                </HeaderCell>
                <HeaderCell align="right">
                  <Trans>FDV</Trans>
                </HeaderCell>
                <HeaderCell align="right">
                  <Trans>Holders</Trans>
                </HeaderCell>
              </Header>

              {(slicedTokens ?? []).map((token, index) => (
                <TokenListItem key={index} index={index} token={token} />
              ))}
            </>
          ) : isNullArgs(slicedTokens) ? (
            <Box sx={{ padding: "24px" }}>
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
            </Box>
          ) : (
            <NoData />
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}
