import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { useTokenHolders } from "@icpswap/hooks";
import { Flex, LoadingRow } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useToken } from "hooks/index";
import { useTranslation } from "react-i18next";
import { toFormat } from "utils/index";
import { useInitialHighcharts } from "./Highcharts";

const OTHER_ACCOUNTS = "Other accounts";

export interface TokenHoldersChartsProps {
  tokenId: string | Null;
}

export function TokenHoldersCharts({ tokenId }: TokenHoldersChartsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [, token] = useToken(tokenId);
  const { result } = useTokenHolders(tokenId, 1, 100);

  const { top100HoldAmount, totalHolders, top100HoldPercent, totalSupply } = useMemo(() => {
    if (isUndefinedOrNull(result)) return {};

    const totalHolders = result.totalElements;

    const totalSupply = result.content[0].totalSupply;

    const top100HoldAmount = result.content.reduce((prev, curr) => {
      return prev.plus(curr.amount);
    }, new BigNumber(0));

    const top100HoldPercent = new BigNumber(top100HoldAmount).dividedBy(totalSupply).multipliedBy(100).toFixed(2);

    return { totalHolders, top100HoldAmount, totalSupply, top100HoldPercent };
  }, [result]);

  const charts = useMemo(() => {
    if (
      isUndefinedOrNull(result) ||
      isUndefinedOrNull(top100HoldPercent) ||
      isUndefinedOrNull(top100HoldAmount) ||
      isUndefinedOrNull(totalSupply)
    )
      return [];

    const top100Holders = result.content.map((element) => {
      const percent = new BigNumber(element.amount).dividedBy(element.totalSupply).multipliedBy(100).toFixed(2);
      return {
        value: element.amount,
        address: element.owner ?? element.accountId,
        percent,
        alias: element.alias,
        sub: element.subaccount,
      };
    });

    const otherAccounts = {
      value: new BigNumber(totalSupply).minus(top100HoldAmount).toFixed(2),
      address: OTHER_ACCOUNTS,
      percent: new BigNumber(100).minus(top100HoldPercent).toFixed(2),
      alias: OTHER_ACCOUNTS,
      sub: undefined,
    };

    return [...top100Holders, otherAccounts];
  }, [result, top100HoldPercent, top100HoldAmount, totalSupply]);

  useInitialHighcharts({ id: "highcharts-id", charts });

  return (
    <Box sx={{ width: "100%", padding: "0 25px" }}>
      <Box sx={{ width: "100%", overflow: "auto", border: "1px solid #29314F", borderRadius: "16px" }}>
        <Flex sx={{ height: "72px", borderBottom: "1px solid #29314F" }}>
          <Box sx={{ flex: "50%" }}>
            <Flex fullWidth gap="0 4px" justify="center">
              <img width="20px" height="20px" src="/images/icons/bulb.svg" alt="" />
              <Typography color="text.primary">
                {t("info.swap.tokens.holders.percent", {
                  percent: top100HoldPercent ? `${top100HoldPercent}%` : "--",
                  amount: top100HoldAmount ? toFormat(new BigNumber(top100HoldAmount).toFixed(2)) : "--",
                  symbol: token?.symbol,
                })}
              </Typography>
            </Flex>
          </Box>

          <Box sx={{ flex: "50%", borderLeft: `1px solid ${theme.palette.border["3"]}` }}>
            <Flex fullWidth justify="center" gap="0 4px">
              <img width="20px" height="20px" src="/images/icons/bulb.svg" alt="" />
              <Flex>
                <Typography color="text.primary" sx={{ paddingRight: "8px" }}>
                  {t("common.token.total.supply.colon")}{" "}
                  {totalSupply ? toFormat(new BigNumber(totalSupply).toFixed(2)) : "--"} {token?.symbol}
                </Typography>

                <Typography color="text.primary" sx={{ borderLeft: "1px solid #ffffff", paddingLeft: "8px" }}>
                  {t("common.token.total.holders.colon")} {totalHolders ?? "--"}
                </Typography>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Box sx={{ margin: "24px 0 0 0" }}>
          <Flex justify="center">
            <Typography color="#ffffff" align="center" fontSize="18px" fontWeight={500}>
              {t("common.token.top.100.holders", { symbol: token?.symbol })}
            </Typography>
          </Flex>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <Flex justify="center" sx={{ height: "400px" }}>
              {charts.length === 0 ? (
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
                  <div />
                  <div />
                </LoadingRow>
              ) : (
                <Box id="highcharts-id" />
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
