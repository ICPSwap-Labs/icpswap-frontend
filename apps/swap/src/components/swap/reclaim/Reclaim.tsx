import { useCallback, useMemo } from "react";
import { Box, Typography, useTheme, makeStyles, Theme } from "components/Mui";
import { DotLoading } from "components/index";
import { useParsedQueryString, useSwapUserUnusedTokenByPool } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import type { Null } from "@icpswap/types";
import { Flex, MainCard } from "@icpswap/ui";
import { AlertTriangle } from "react-feather";
import { BigNumber, isNullArgs, nonNullArgs, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Pool, Token } from "@icpswap/swap-sdk";
import { useGlobalContext } from "hooks/index";
import { CanisterIcon } from "assets/icons/swap/CanisterIcon";
import colors from "theme/colors";
import { DepositButton } from "components/swap/reclaim/DepositButton";
import { WithdrawButton } from "components/swap/reclaim/WithdrawButton";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: "12px 10px",
    "&.border": {
      borderBottom: `1px solid ${theme.palette.background.level3}`,
    },
  },
}));

export interface ReclaimLinkProps {
  fontSize?: "12px" | "14px";
  margin?: string;
  ui?: "pro" | "normal";
  pool: Pool | Null;
  refreshKey?: string;
  keepInPool?: boolean;
  bg1?: string;
  onInputTokenClick?: (amount: string) => void;
  inputToken?: Token | Null;
}

export function ReclaimTokensInPool({
  pool,
  fontSize = "14px",
  ui,
  refreshKey,
  bg1,
  onInputTokenClick,
  inputToken,
}: ReclaimLinkProps) {
  const theme = useTheme();
  const classes = useStyles();
  const principal = useAccountPrincipal();
  const { reclaim } = useParsedQueryString() as { reclaim: string };

  const { refreshTriggers, setRefreshTriggers } = useGlobalContext();

  const { balances } = useSwapUserUnusedTokenByPool(
    pool,
    principal,
    refreshKey ? refreshTriggers[refreshKey] : undefined,
  );

  const { token0, token1 } = useMemo(() => {
    if (!pool) return {};
    return { token0: pool.token0, token1: pool.token1 };
  }, [pool]);

  const { token0TotalAmount, token1TotalAmount } = useMemo(() => {
    if (!token0 || !token1 || !balances || balances.length === 0) return {};

    const { token0TotalAmount, token1TotalAmount } = balances.reduce(
      (prev, curr) => {
        return {
          token0TotalAmount: prev.token0TotalAmount + curr.balance0,
          token1TotalAmount: prev.token1TotalAmount + curr.balance1,
        };
      },
      { token0TotalAmount: BigInt(0), token1TotalAmount: BigInt(0) },
    );

    return { token0TotalAmount: token0TotalAmount.toString(), token1TotalAmount: token1TotalAmount.toString() };
  }, [token0, token1, balances]);

  const handleRefresh = useCallback(() => {
    if (setRefreshTriggers && nonNullArgs(refreshKey)) {
      setRefreshTriggers(refreshKey);
    }
  }, [setRefreshTriggers, refreshKey]);

  const __fontSize = useMemo(() => {
    if (ui === "pro") return "12px";
    return fontSize;
  }, [fontSize, ui]);

  const handleTokenClick = useCallback(
    (token: Token, tokenAmount: string | undefined) => {
      if (isNullArgs(inputToken) || isNullArgs(tokenAmount)) return;

      if (inputToken.address === token.address) {
        if (onInputTokenClick) onInputTokenClick(tokenAmount);
      }
    },
    [inputToken],
  );

  const availableWithdrawTokens = useMemo(() => {
    if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(token0TotalAmount) || isNullArgs(token1TotalAmount))
      return [];

    const __availableWithdrawTokens: Array<{ token: Token; amount: string }> = [];

    if (token0TotalAmount && new BigNumber(token0TotalAmount).isGreaterThan(0)) {
      __availableWithdrawTokens.push({ token: token0, amount: token0TotalAmount });
    }

    if (token1TotalAmount && new BigNumber(token1TotalAmount).isGreaterThan(0)) {
      __availableWithdrawTokens.push({ token: token1, amount: token1TotalAmount });
    }

    return __availableWithdrawTokens;
  }, [token0, token1, token0TotalAmount, token1TotalAmount]);

  return nonNullArgs(pool) ? (
    <>
      {availableWithdrawTokens.length > 0 ? (
        <MainCard padding="16px 24px" level={1}>
          <Flex align="center" gap="0 8px">
            <AlertTriangle size={14} color={colors.danger} />

            <Flex align="center">
              <Flex>
                <Typography>
                  You have{" "}
                  {toSignificantWithGroupSeparator(
                    parseTokenAmount(
                      availableWithdrawTokens[0].amount,
                      availableWithdrawTokens[0].token.decimals,
                    ).toString(),
                  )}{" "}
                  {availableWithdrawTokens[0].token.symbol} to
                </Typography>
                &nbsp;
                <WithdrawButton
                  pool={pool}
                  token={availableWithdrawTokens[0].token}
                  balances={balances}
                  onReclaimSuccess={handleRefresh}
                  fontSize={__fontSize}
                />
              </Flex>

              {availableWithdrawTokens.length > 1 ? (
                <Flex>
                  <Typography>
                    , and{" "}
                    {toSignificantWithGroupSeparator(
                      parseTokenAmount(
                        availableWithdrawTokens[1].amount,
                        availableWithdrawTokens[0].token.decimals,
                      ).toString(),
                    )}{" "}
                    {availableWithdrawTokens[1].token.symbol} to
                  </Typography>
                  &nbsp;
                  <WithdrawButton
                    pool={pool}
                    token={availableWithdrawTokens[1].token}
                    balances={balances}
                    onReclaimSuccess={handleRefresh}
                    fontSize={__fontSize}
                  />
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </MainCard>
      ) : null}

      {reclaim === "true" ? (
        <MainCard padding="16px 24px" level={1}>
          <Box sx={{ background: bg1 ?? theme.palette.background.level2, borderRadius: "12px", margin: "14px 0 0 0" }}>
            <Box className={`${classes.wrapper} ${ui} border`}>
              <Flex justify="space-between">
                <Flex gap="0 4px">
                  <CanisterIcon />
                  <Typography
                    sx={{ fontSize: __fontSize, cursor: "pointer" }}
                    onClick={() => handleTokenClick(pool.token0, token0TotalAmount)}
                  >
                    {token0?.symbol ?? "--"}:{" "}
                    {token0TotalAmount && token0
                      ? toSignificantWithGroupSeparator(parseTokenAmount(token0TotalAmount, token0.decimals).toString())
                      : "--"}
                  </Typography>
                </Flex>

                <Flex gap={ui === "pro" ? "0 10px" : "0 16px"}>
                  <DepositButton pool={pool} token={token0} onDepositSuccess={handleRefresh} fontSize={__fontSize} />
                  <WithdrawButton
                    pool={pool}
                    token={token0}
                    balances={balances}
                    onReclaimSuccess={handleRefresh}
                    fontSize={__fontSize}
                  />
                </Flex>
              </Flex>
            </Box>
            <Box className={`${classes.wrapper} ${ui}`}>
              <Flex justify="space-between">
                {pool ? (
                  <Flex gap="0 4px">
                    <CanisterIcon />
                    <Typography
                      sx={{ fontSize: __fontSize, cursor: "pointer" }}
                      onClick={() => handleTokenClick(pool.token1, token1TotalAmount)}
                    >
                      {token1?.symbol ?? "--"}:{" "}
                      {token1TotalAmount && token1
                        ? toSignificantWithGroupSeparator(
                            parseTokenAmount(token1TotalAmount, token1.decimals).toString(),
                          )
                        : "--"}
                    </Typography>
                  </Flex>
                ) : (
                  <DotLoading loading size="3px" color="#ffffff" />
                )}
                <Flex gap={ui === "pro" ? "0 10px" : "0 16px"}>
                  <DepositButton pool={pool} token={token1} onDepositSuccess={handleRefresh} fontSize={__fontSize} />
                  <WithdrawButton
                    pool={pool}
                    token={token1}
                    balances={balances}
                    onReclaimSuccess={handleRefresh}
                    fontSize={__fontSize}
                  />
                </Flex>
              </Flex>
            </Box>
          </Box>
        </MainCard>
      ) : null}
    </>
  ) : null;
}
