import { useHistory } from "react-router-dom";
import { useCallback, useContext, useMemo, useState } from "react";
import { Box, Typography, useTheme, Collapse, Checkbox, makeStyles, CircularProgress } from "components/Mui";
import { Tooltip } from "components/index";
import { Trans, t } from "@lingui/macro";
import { useSwapUserUnusedTokenByPool } from "@icpswap/hooks";
import { SwapContext } from "components/swap/index";
import { useAccountPrincipal } from "store/auth/hooks";
import type { UserSwapPoolsBalance } from "@icpswap/types";
import { Flex, TextButton } from "@icpswap/ui";
import { ArrowUpRight, ChevronDown, RotateCcw } from "react-feather";
import { Theme } from "@mui/material/styles";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { DepositModal } from "components/swap/DepositModal";
import { Pool, Token } from "@icpswap/swap-sdk";
import { useReclaim } from "hooks/swap/useReclaim";
import { KeepTokenInPoolsConfirmModal } from "components/swap/KeepTokenInPoolsConfirm";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: "16px",
    "&.pro": {
      padding: "12px",
    },
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

  return (
    <Flex gap="0 8px">
      <TextButton onClick={handleWithdraw} sx={{ fontSize }}>
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
}

export function Reclaim({ fontSize = "14px", ui }: ReclaimLinkProps) {
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();
  const principal = useAccountPrincipal();

  const [open, setOpen] = useState(true);
  const [checkOpen, setCheckOpen] = useState(false);

  const { selectedPool, refreshTrigger, setRefreshTrigger } = useContext(SwapContext);
  const [keepInPools, updateKeepInPools] = useSwapKeepTokenInPoolsManager();
  const { balances } = useSwapUserUnusedTokenByPool(selectedPool, principal, refreshTrigger);

  const { token0, token1 } = useMemo(() => {
    if (!selectedPool) return {};

    return { token0: selectedPool.token0, token1: selectedPool.token1 };
  }, [selectedPool]);

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
    history.push("/swap/reclaim");
  }, [history]);

  const handleCollapse = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const handleCheckChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setCheckOpen(true);
    }
  }, []);

  const handleToggleCheck = useCallback(() => {
    if (!keepInPools) {
      setCheckOpen(true);
    } else {
      updateKeepInPools(false);
    }
  }, [setCheckOpen, keepInPools, updateKeepInPools]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  const handleCheckConfirm = useCallback(() => {
    updateKeepInPools(true);
    setCheckOpen(false);
  }, [updateKeepInPools, setCheckOpen]);

  return (
    <Box>
      <Flex align="center" justify="space-between" sx={{ cursor: "pointer" }} onClick={handleCollapse}>
        <Flex align="center" gap="0 3px">
          <Typography sx={{ fontSize: ui === "pro" ? "12px" : "14px" }}>
            <Trans>
              Your {token0?.symbol ?? "--"}/{token1?.symbol ?? "--"} Swap Pool Balances
            </Trans>
          </Typography>
          <Tooltip
            tips={t`Pre-depositing tokens into the swap pool lets you initiate swap anytime, reducing the risk of sandwich attacks by bots. You can keep swapped tokens in the pool for future use. This process removes deposit wait times and may lower transfer fees. You can manage your balance anytime, with options to deposit or withdraw as needed.`}
          />
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
        <Flex justify="space-between" align="center" sx={{ margin: ui === "pro" ? "12px 0 0 0" : "18px 0 0 0" }}>
          <Flex
            sx={{ width: "fit-content", cursor: "pointer", userSelect: "none" }}
            gap="0 4px"
            onClick={handleToggleCheck}
            align="center"
          >
            <Checkbox size="small" onChange={handleCheckChange} checked={keepInPools} />

            <Typography sx={{ fontSize: ui === "pro" ? "12px" : "14px" }}>
              <Trans>Keep your swapped tokens in Swap Pool</Trans>
            </Typography>
          </Flex>
          <RotateCcw size={14} style={{ cursor: "pointer" }} onClick={handleRefresh} />
        </Flex>

        <Box sx={{ background: theme.palette.background.level2, borderRadius: "12px", margin: "14px 0 0 0" }}>
          <Box className={`${classes.wrapper} ${ui} border`}>
            <Flex justify="space-between">
              <Typography sx={{ fontSize: ui === "pro" ? "12px" : "14px" }}>
                <Trans>
                  {token0?.symbol ?? "--"} Amount:{" "}
                  {token0TotalAmount && token0
                    ? toSignificantWithGroupSeparator(parseTokenAmount(token0TotalAmount, token0.decimals).toString())
                    : "--"}
                </Trans>
              </Typography>
              <Flex gap={ui === "pro" ? "0 10px" : "0 16px"}>
                <DepositButton
                  pool={selectedPool}
                  token={token0}
                  onDepositSuccess={handleRefresh}
                  fontSize={ui === "pro" ? "12px" : "14px"}
                />
                <WithdrawButton
                  pool={selectedPool}
                  token={token0}
                  balances={balances}
                  onReclaimSuccess={handleRefresh}
                  fontSize={ui === "pro" ? "12px" : "14px"}
                />
              </Flex>
            </Flex>
          </Box>
          <Box className={`${classes.wrapper} ${ui}`}>
            <Flex justify="space-between">
              <Typography sx={{ fontSize: ui === "pro" ? "12px" : "14px" }}>
                {token1?.symbol ?? "--"} Amount:{" "}
                {token1TotalAmount && token1
                  ? toSignificantWithGroupSeparator(parseTokenAmount(token1TotalAmount, token1.decimals).toString())
                  : "--"}
              </Typography>
              <Flex gap={ui === "pro" ? "0 10px" : "0 16px"}>
                <DepositButton
                  pool={selectedPool}
                  token={token1}
                  onDepositSuccess={handleRefresh}
                  fontSize={ui === "pro" ? "12px" : "14px"}
                />
                <WithdrawButton
                  pool={selectedPool}
                  token={token1}
                  balances={balances}
                  onReclaimSuccess={handleRefresh}
                  fontSize={ui === "pro" ? "12px" : "14px"}
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

      <KeepTokenInPoolsConfirmModal
        open={checkOpen}
        onCancel={() => setCheckOpen(false)}
        onConfirm={handleCheckConfirm}
      />
    </Box>
  );
}
