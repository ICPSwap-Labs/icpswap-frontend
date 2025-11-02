import { useMemo } from "react";
import { Box, Typography, makeStyles } from "components/Mui";
import { formatDollarAmount, formatDollarTokenPrice, BigNumber, formatIcpAmount } from "@icpswap/utils";
import { LoadingRow, TokenImage } from "components/index";
import { useICPPrice } from "store/global/hooks";
import { Header, HeaderCell, TableRow, BodyCell, Flex, Proportion, Link } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { useTokens } from "hooks/info/tokens/index";
import { type TokensTreeMapRow } from "@icpswap/types";
import { generateLogoUrl } from "hooks/token/useTokenLogo";

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

interface TokenListItemProps {
  token: TokensTreeMapRow;
  index: number;
}

function TokenListItem({ token, index }: TokenListItemProps) {
  const classes = useStyles();
  const icpPrice = useICPPrice();

  return (
    <Link to={`/info-tokens/details/${token.tokenLedgerId}`}>
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
          <TokenImage logo={generateLogoUrl(token.tokenLedgerId)} size="40px" tokenId={token.tokenLedgerId} />
          <Typography fontSize="16px" color="text.primary">
            {token.tokenSymbol}
          </Typography>
        </Flex>
        <Flex vertical gap="6px 0" align="flex-start">
          <BodyCell sx={{ width: "100%" }} align="right">
            {formatDollarTokenPrice(token.price)}
          </BodyCell>
          <BodyCell sub sx={{ width: "100%" }} align="right">
            {icpPrice ? `${formatIcpAmount(new BigNumber(token.price).dividedBy(icpPrice).toNumber())} ICP` : "--"}
          </BodyCell>
        </Flex>
        <BodyCell align="right">
          <Proportion value={token.priceChange24H} fontWeight={400} />
        </BodyCell>
        <Flex vertical gap="6px 0" align="flex-start">
          <BodyCell align="right" sx={{ width: "100%" }}>
            {icpPrice && token ? formatDollarAmount(token.fdv) : "--"}
          </BodyCell>
          <BodyCell sub align="right" sx={{ width: "100%" }}>
            {icpPrice && token
              ? `${formatIcpAmount(new BigNumber(token.fdv).dividedBy(icpPrice).toNumber())} ICP`
              : "--"}
          </BodyCell>
        </Flex>
        <BodyCell align="right">{new BigNumber(token.holder).toFormat()}</BodyCell>
      </TableRow>
    </Link>
  );
}

export function Tokens() {
  const { t } = useTranslation();
  const classes = useStyles();
  const allTokens = useTokens();

  const sortedTokens = useMemo(() => {
    return allTokens
      .sort((a, b) => {
        if (a && b) {
          if (new BigNumber(a.rank).isLessThan(b.rank)) return -1;
          if (new BigNumber(a.rank).isGreaterThan(b.rank)) return 1;
          return 0;
        }

        return 0;
      })
      .filter((element) => element.tokenSymbol !== "ICP");
  }, [allTokens]);

  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>{t("common.token.list")}</Typography>

      <Box sx={{ width: "100%", overflow: "auto", margin: "24px 0 0 0" }}>
        {allTokens && allTokens.length > 0 ? (
          <>
            <Header className={classes.wrapper}>
              <HeaderCell>{t("common.index")}</HeaderCell>
              <HeaderCell>{t("common.symbol")}</HeaderCell>
              <HeaderCell align="right">{t("common.price")}</HeaderCell>
              <HeaderCell align="right">{t("common.price.change")}</HeaderCell>
              <HeaderCell align="right">{t("common.fdv")}</HeaderCell>
              <HeaderCell align="right">{t("common.holders")}</HeaderCell>
            </Header>

            {sortedTokens.map((token, index) => (
              <TokenListItem key={index} index={index} token={token} />
            ))}
          </>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}
