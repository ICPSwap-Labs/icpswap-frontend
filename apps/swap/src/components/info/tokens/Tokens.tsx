import { useMemo, useState, useCallback } from "react";
import { Box, Typography, makeStyles } from "components/Mui";
import {
  parseTokenAmount,
  formatDollarAmount,
  formatDollarTokenPrice,
  BigNumber,
  nonUndefinedOrNull,
  isUndefinedOrNull,
  formatIcpAmount,
} from "@icpswap/utils";
import { useToken } from "hooks/index";
import { NoData, LoadingRow, TokenImage } from "components/index";
import { TokenListMetadata } from "@icpswap/candid";
import { useTokensFromList, useTokenSupply, useInfoToken, useTokenDetails } from "@icpswap/hooks";
import { useICPPrice } from "store/global/hooks";
import { Header, HeaderCell, TableRow, BodyCell, Flex, Proportion, Link } from "@icpswap/ui";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";

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

function TokenListItem({ token: tokenMetadata, index }: { token: TokenListMetadata; index: number }) {
  const classes = useStyles();

  const [, token] = useToken(tokenMetadata.canisterId);
  const { result: supply } = useTokenSupply(tokenMetadata.canisterId);
  const { result: tokenDetails } = useTokenDetails(tokenMetadata.canisterId);

  const infoToken = useInfoToken(tokenMetadata.canisterId);
  const icpPrice = useICPPrice();

  return (
    <Link to={`/info-tokens/details/${tokenMetadata.canisterId}`}>
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
          <TokenImage logo={token?.logo} size="40px" tokenId={token?.address} />
          <Typography fontSize="16px" color="text.primary">
            {token?.symbol}
          </Typography>
        </Flex>
        <Flex vertical gap="6px 0" align="flex-start">
          <BodyCell sx={{ width: "100%" }} align="right">
            {infoToken ? formatDollarTokenPrice(infoToken.price) : "--"}
          </BodyCell>
          <BodyCell sub sx={{ width: "100%" }} align="right">
            {infoToken && icpPrice
              ? `${formatIcpAmount(new BigNumber(infoToken.price).dividedBy(icpPrice).toNumber())} ICP`
              : "--"}
          </BodyCell>
        </Flex>
        <BodyCell align="right">
          <Proportion value={infoToken?.priceChange24H} fontWeight={400} />
        </BodyCell>
        <Flex vertical gap="6px 0" align="flex-start">
          <BodyCell align="right" sx={{ width: "100%" }}>
            {infoToken && icpPrice && supply && token
              ? formatDollarAmount(
                  new BigNumber(infoToken.price).multipliedBy(parseTokenAmount(supply, token.decimals)).toNumber(),
                )
              : "--"}
          </BodyCell>
          <BodyCell sub align="right" sx={{ width: "100%" }}>
            {infoToken && icpPrice && supply && token
              ? `${formatIcpAmount(
                  new BigNumber(infoToken.price)
                    .multipliedBy(parseTokenAmount(supply, token.decimals))
                    .dividedBy(icpPrice)
                    .toNumber(),
                )} ICP`
              : "--"}
          </BodyCell>
        </Flex>
        <BodyCell align="right">
          {nonUndefinedOrNull(tokenDetails) && nonUndefinedOrNull(tokenDetails.holderAmount)
            ? new BigNumber(tokenDetails.holderAmount).toFormat()
            : "--"}
        </BodyCell>
      </TableRow>
    </Link>
  );
}

const PAGE_SIZE = 10;
const START_PAGE = 1;

export function Tokens() {
  const { t } = useTranslation();
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
      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>{t("common.token.list")}</Typography>

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
                <HeaderCell>{t("common.index")}</HeaderCell>
                <HeaderCell>{t("common.symbol")}</HeaderCell>
                <HeaderCell align="right">{t("common.price")}</HeaderCell>
                <HeaderCell align="right">{t("common.price.change")}</HeaderCell>
                <HeaderCell align="right">{t("common.fdv")}</HeaderCell>
                <HeaderCell align="right">{t("common.holders")}</HeaderCell>
              </Header>

              {(slicedTokens ?? []).map((token, index) => (
                <TokenListItem key={index} index={index} token={token} />
              ))}
            </>
          ) : isUndefinedOrNull(slicedTokens) ? (
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
