import { Box, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import { formatAmount, formatDollarAmount, formatDollarTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { Header, HeaderCell, Flex, LoadingRow, NoData, BodyCell, TableRow, Proportion } from "@icpswap/ui";
import { ToolsWrapper } from "components/info/tools/index";
import { useTranslation } from "react-i18next";
import { useLatestTokens } from "@icpswap/hooks";
import { LatestToken } from "@icpswap/types";
import { TokenImage, TimestampCell } from "components/index";
import { generateLogoUrl } from "hooks/token/useTokenLogo";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      padding: "24px",
      alignItems: "center",
      gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 160px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 160px",
        padding: "16px",
      },
    },
  };
});

interface TokenRowProps {
  token: LatestToken;
  className?: string;
}

function TokenRow({ token, className }: TokenRowProps) {
  return (
    <TableRow className={className}>
      <BodyCell>
        <Flex gap="0 8px">
          <TokenImage tokenId={token.ledgerId} logo={generateLogoUrl(token.ledgerId ?? "")} />
          <BodyCell>{token.symbol}</BodyCell>
        </Flex>
      </BodyCell>
      <BodyCell align="right">
        <BodyCell align="right">{formatDollarTokenPrice(token.price)}</BodyCell>
        <BodyCell sub align="right">
          {token.priceICP}
        </BodyCell>
      </BodyCell>
      <BodyCell align="right">
        <Proportion value={token.priceChange24} />
      </BodyCell>
      <BodyCell align="right">{formatDollarAmount(token.liquidity)}</BodyCell>
      <BodyCell align="right">{formatAmount(token.holders)}</BodyCell>
      <BodyCell align="right">
        <TimestampCell timestamp={token.createTime} />
      </BodyCell>
    </TableRow>
  );
}

export function LatestTokens() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const { data: latestTokens, isPending } = useLatestTokens();

  return (
    <>
      <ToolsWrapper
        title={
          <Flex
            fullWidth
            justify="space-between"
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px 0",
              },
            }}
          >
            <Typography color="inherit" fontSize="inherit" fontWeight="inherit">
              New Tokens (Last 72h)
            </Typography>
          </Flex>
        }
      >
        <Box sx={{ width: "100%", overflow: "auto" }}>
          <Box sx={{ minWidth: "1152px" }}>
            <Box>
              <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
                <HeaderCell field="pair">{t("common.token")}</HeaderCell>

                <HeaderCell align="right" field="tvl">
                  {t("common.price")}
                </HeaderCell>

                <HeaderCell align="right" field="change">
                  {t("common.price.change.24h")}
                </HeaderCell>

                <HeaderCell align="right" field="liquidity">
                  {t("common.liquidity")}
                </HeaderCell>

                <HeaderCell align="right" field="liquidity">
                  {t("common.holders")}
                </HeaderCell>

                <HeaderCell align="right" field="added">
                  Added
                </HeaderCell>
              </Header>

              {isPending || isUndefinedOrNull(latestTokens) ? (
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
                  </LoadingRow>
                </Box>
              ) : latestTokens.length > 0 ? (
                <>
                  {latestTokens.map((token, index) => (
                    <TokenRow key={`${token.symbol}_${index}`} token={token} className={classes.wrapper} />
                  ))}
                </>
              ) : (
                <NoData tip={t("info.tools.swap.transactions.empty")} />
              )}
            </Box>
          </Box>
        </Box>
      </ToolsWrapper>
    </>
  );
}
