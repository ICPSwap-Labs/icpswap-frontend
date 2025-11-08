import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { useTokenHolders } from "@icpswap/hooks";
import { Flex, LoadingRow } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useToken } from "hooks/index";
import { useTranslation } from "react-i18next";
import { toFormat } from "utils/index";
import { useInitialHighcharts } from "components/info/tokens/Highcharts";
import { useMediaQuery640 } from "hooks/theme";

const OTHER_ACCOUNTS = "Other accounts";

export interface TokenHoldersChartsProps {
  tokenId: string | Null;
}

export function TokenHoldersCharts({ tokenId }: TokenHoldersChartsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [, token] = useToken(tokenId);
  const { result } = useTokenHolders(tokenId, 1, 100);
  const downMedia640 = useMediaQuery640();

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
        <Flex
          sx={{
            borderBottom: "1px solid #29314F",
            height: downMedia640 ? "auto" : "72px",
            padding: downMedia640 ? "0 16px" : "0px",
          }}
          vertical={downMedia640}
        >
          <Box
            sx={{
              flex: downMedia640 ? "100%" : "50%",
              padding: "16px 0",
              width: downMedia640 ? "100%" : "fit-content",
            }}
          >
            <Flex
              fullWidth
              gap="0 4px"
              justify={downMedia640 ? "left" : "center"}
              align={downMedia640 ? "top" : "center"}
            >
              <img
                width={`${downMedia640 ? "16px" : "20px"}`}
                height={`${downMedia640 ? "16px" : "20px"}`}
                src="/images/icons/bulb.svg"
                alt=""
                style={{ position: "relative", top: downMedia640 ? "4px" : "0px" }}
              />
              <Typography
                sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px", lineHeight: "18px" } }}
              >
                {t("info.swap.tokens.holders.percent", {
                  percent: top100HoldPercent ? `${top100HoldPercent}%` : "--",
                  amount: top100HoldAmount ? toFormat(new BigNumber(top100HoldAmount).toFixed(2)) : "--",
                  symbol: token?.symbol,
                })}
              </Typography>
            </Flex>
          </Box>

          <Box
            sx={{
              flex: downMedia640 ? "100%" : "50%",
              borderLeft: downMedia640 ? "none" : `1px solid ${theme.palette.border["3"]}`,
              borderTop: downMedia640 ? `1px solid ${theme.palette.border["3"]}` : "none",
              padding: "16px 0",
              width: downMedia640 ? "100%" : "fit-content",
            }}
          >
            <Flex
              fullWidth
              justify={downMedia640 ? "left" : "center"}
              gap="0 4px"
              align={downMedia640 ? "top" : "center"}
            >
              <img
                width={`${downMedia640 ? "16px" : "20px"}`}
                height={`${downMedia640 ? "16px" : "20px"}`}
                src="/images/icons/bulb.svg"
                alt=""
                style={{ position: "relative", top: downMedia640 ? "4px" : "0px" }}
              />

              <Flex vertical={downMedia640} gap="10px 0" align={downMedia640 ? "left" : "center"}>
                <Typography
                  color="text.primary"
                  sx={{
                    paddingRight: "8px",
                    borderRight: "1px solid #ffffff",
                    "@media(max-width: 640px)": { fontSize: "12px" },
                  }}
                >
                  {t("common.token.total.supply.colon")}{" "}
                  {totalSupply ? toFormat(new BigNumber(totalSupply).toFixed(2)) : "--"} {token?.symbol}
                </Typography>

                <Typography
                  color="text.primary"
                  sx={{
                    paddingLeft: downMedia640 ? "0px" : "8px",
                    "@media(max-width: 640px)": { fontSize: "12px" },
                  }}
                >
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
