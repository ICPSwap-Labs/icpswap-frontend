import { useHistory } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { Box, Typography, useTheme, Collapse, makeStyles, CircularProgress, Theme } from "components/Mui";
import { Tooltip, DotLoading } from "components/index";
import { Trans, t } from "@lingui/macro";
import { useSwapUserUnusedTokenByPool } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import type { Null, UserSwapPoolsBalance } from "@icpswap/types";
import { Flex, TextButton } from "@icpswap/ui";
import { ArrowUpRight, ChevronDown } from "react-feather";
import { isNullArgs, nonNullArgs, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { DepositModal } from "components/swap/DepositModal";
import { Pool, Token } from "@icpswap/swap-sdk";
import { useReclaim } from "hooks/swap/useReclaim";
import { KeepTokenInPool } from "components/swap/KeepTokenInPool";
import { useGlobalContext } from "hooks/index";

import { CanisterIcon } from "./icons/CanisterIcon";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: "12px 10px",
    "&.border": {
      borderBottom: `1px solid ${theme.palette.background.level3}`,
    },
  },
}));

interface DepositButtonProps {
  token: Token | undefined;
  pool: Pool | null | undefined;
  onDepositSuccess: () => void;
  fontSize?: string;
}

function DepositButton({ token, pool, fontSize, onDepositSuccess }: DepositButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TextButton onClick={() => setOpen(true)} sx={{ fontSize }}>
        Deposit
      </TextButton>
      {open && pool && token ? (
        <DepositModal
          open={open}
          onClose={() => setOpen(false)}
          pool={pool}
          token={token}
          onDepositSuccess={onDepositSuccess}
        />
      ) : null}
    </>
  );
}

interface WithdrawButtonProps {
  token: Token | undefined;
  pool: Pool | null | undefined;
  balances: UserSwapPoolsBalance[];
  onReclaimSuccess: () => void;
  fontSize?: string;
}

function WithdrawButton({ token, pool, balances, onReclaimSuccess, fontSize }: WithdrawButtonProps) {
  const [loading, setLoading] = useState(false);

  const __balances = useMemo(() => {
    if (!token || balances.length === 0) return [];

    return balances
      .reduce(
        (prev, curr) => {
          return prev.concat([
            curr.token0.address === token.address ? [curr.balance0, curr.type] : [curr.balance1, curr.type],
          ]);
        },
        [] as Array<[bigint, "unDeposit" | "unUsed"]>,
      )
      .filter(([balance]) => balance > token.transFee);
  }, [token, balances]);

  const reclaim = useReclaim();

  const handleWithdraw = useCallback(async () => {
    if (!token || loading || !pool || __balances.length === 0) return;

    setLoading(true);

    await Promise.all(
      __balances.map(async ([balance, type]) => {
        return await reclaim({ token, poolId: pool.id, type, balance });
      }),
    );

    onReclaimSuccess();

    setLoading(false);
  }, [__balances, loading, token, pool]);

  const disabled = useMemo(() => {
    if (!__balances || __balances.length === 0 || !token) return true;
    return false;
  }, [__balances, token]);

  return (
    <Flex gap="0 8px">
      <TextButton onClick={handleWithdraw} sx={{ fontSize }} disabled={disabled}>
        Withdraw
      </TextButton>
      {loading ? <CircularProgress size={fontSize === "14px" ? 14 : 12} sx={{ color: "#ffffff" }} /> : null}
    </Flex>
  );
}

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

export function Reclaim({
  pool,
  keepInPool = true,
  fontSize = "14px",
  ui,
  refreshKey,
  bg1,
  onInputTokenClick,
  inputToken,
}: ReclaimLinkProps) {
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();
  const principal = useAccountPrincipal();

  const [open, setOpen] = useState(true);

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

  const handleViewAll = useCallback(() => {
    history.push("/swap/withdraw");
  }, [history]);

  const handleCollapse = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

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

  return (
    <Box>
      <Flex align="center" justify="space-between" sx={{ cursor: "pointer" }} onClick={handleCollapse}>
        <Flex align="center" gap="0 3px">
          {!pool ? (
            <DotLoading loading size="3px" color="#ffffff" />
          ) : (
            <>
              <Typography sx={{ fontSize: __fontSize }}>
                <Trans>
                  Your Balance in {token0?.symbol ?? "--"}/{token1?.symbol ?? "--"} Swap Pool
                </Trans>
              </Typography>
              <Tooltip
                tips={t`Pre-depositing tokens into the swap pool lets you initiate swap anytime, reducing the risk of sandwich attacks by bots. You can keep swapped tokens in the pool for future use. This process removes deposit wait times and may lower transfer fees. You can manage your balance anytime, with options to deposit or withdraw as needed.`}
              />
            </>
          )}
        </Flex>

        <ChevronDown
          size={16}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "all 300ms",
          }}
        />
      </Flex>

      <Collapse in={open}>
        {keepInPool ? <KeepTokenInPool ui={ui} refreshKey={refreshKey} /> : null}

        <Box sx={{ background: bg1 ?? theme.palette.background.level2, borderRadius: "12px", margin: "14px 0 0 0" }}>
          <Box className={`${classes.wrapper} ${ui} border`}>
            <Flex justify="space-between">
              {pool ? (
                <Flex gap="0 4px">
                  <CanisterIcon />
                  <Typography
                    sx={{ fontSize: __fontSize, cursor: "pointer" }}
                    onClick={() => handleTokenClick(pool.token0, token0TotalAmount)}
                  >
                    <Trans>
                      {token0?.symbol ?? "--"}:{" "}
                      {token0TotalAmount && token0
                        ? toSignificantWithGroupSeparator(
                            parseTokenAmount(token0TotalAmount, token0.decimals).toString(),
                          )
                        : "--"}
                    </Trans>
                  </Typography>
                </Flex>
              ) : (
                <DotLoading loading size="3px" color="#ffffff" />
              )}
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
                      ? toSignificantWithGroupSeparator(parseTokenAmount(token1TotalAmount, token1.decimals).toString())
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

        <Flex gap="0 4px" sx={{ cursor: "pointer", margin: "12px 0 0 0" }} onClick={handleViewAll} justify="center">
          <Typography color="secondary" sx={{ fontSize: fontSize ?? "14px" }}>
            <Trans>View All</Trans>
          </Typography>
          <ArrowUpRight color={theme.colors.secondaryMain} size="16px" />
        </Flex>
      </Collapse>
    </Box>
  );
}
