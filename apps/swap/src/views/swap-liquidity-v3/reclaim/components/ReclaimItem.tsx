import { useState, useMemo, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import { Typography, Box, Grid, Button, CircularProgress, Avatar } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Tooltip } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { withdraw, deposit } from "hooks/swap/v3Calls";
import { useHideUnavailableClaimManager } from "store/customization/hooks";

interface ReclaimItemProps {
  poolId: string;
  border?: boolean;
  token: TokenInfo;
  name: string | undefined;
  type: "unDeposit" | "unUsed";
  balance: bigint;
  updateUnavailableKeys: (key: number) => void;
  updateClaimedKey: (key: number) => void;
  claimedKey: number;
  claimedKeys: number[];
}

export function ReclaimItem({
  token,
  balance,
  name,
  poolId,
  type,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
}: ReclaimItemProps) {
  const theme = useTheme() as Theme;
  const { hideUnavailableClaim } = useHideUnavailableClaimManager();

  const [openTip, closeTip] = useTips();

  const [loading, setLoading] = useState<boolean>(false);

  const unavailableClaim = type === "unDeposit" ? balance < token.transFee * BigInt(2) : balance < token.transFee;

  const isClaimed = useMemo(() => {
    return claimedKeys.includes(claimedKey);
  }, [claimedKeys, claimedKey]);

  useEffect(() => {
    if (unavailableClaim === true) {
      updateUnavailableKeys(claimedKey);
    }
  }, [unavailableClaim, claimedKey]);

  const handleClaim = async () => {
    if (loading || unavailableClaim) return;

    setLoading(true);

    const loadingKey = openTip(
      `Withdraw your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    const amount = balance;

    if (amount !== BigInt(0)) {
      if (type === "unDeposit") {
        const result = await deposit(poolId, token.canisterId, amount, token.transFee);

        if (result.status === ResultStatus.OK) {
          const result = await withdraw(poolId, token.canisterId, token.transFee, amount - token.transFee);
          if (result.status === ResultStatus.OK) {
            openTip(`Withdrew ${name} ${token.symbol} successfully`, MessageTypes.success);
            updateClaimedKey(claimedKey);
          } else {
            openTip(`Failed to Withdraw ${name} ${token.symbol}: ${result.message}`, MessageTypes.error);
          }
        } else {
          openTip(`Failed to Withdraw: ${result.message ?? ""}`, MessageTypes.error);
        }
      } else {
        const result = await withdraw(poolId, token.canisterId, token.transFee, amount);

        if (result.status === ResultStatus.OK) {
          openTip(`Withdrew ${name} ${token?.symbol} successfully`, MessageTypes.success);
          updateClaimedKey(claimedKey);
        } else {
          openTip(result.message ? result.message : `Failed to Withdraw ${name} ${token.symbol}`, MessageTypes.error);
        }
      }
    }

    closeTip(loadingKey);

    setLoading(false);
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        padding: "24px",
        borderRadius: "12px",
        background: theme.palette.background.level1,
        margin: "16px 0 0 0",
        ...((hideUnavailableClaim && unavailableClaim) || isClaimed ? { display: "none" } : {}),
        "@media(max-width: 640px)": {
          padding: "12px",
        },
      }}
    >
      <Avatar
        src={token.logo}
        sx={{
          width: "32px",
          height: "32px",
          margin: "0 12px 0 0",
          "@media(max-width: 640px)": {
            width: "24px",
            height: "24px",
          },
        }}
      >
        &nbsp;
      </Avatar>

      <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography
            color="text.primary"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              "@media(max-width: 640px)": {
                fontSize: "16px",
              },
            }}
          >
            {parseTokenAmount(balance, token.decimals).toFormat()} {token.symbol}
          </Typography>
          <Typography sx={{ margin: "4px 0 0 0" }}>{name}</Typography>
          <Typography sx={{ margin: "4px 0 0 0" }}>{poolId}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
          {unavailableClaim ? (
            <Tooltip
              tips="The withdrawal amount is less than the transfer fee, so the withdrawal cannot be processed."
              iconSize="24px"
            />
          ) : null}

          <Button
            variant="contained"
            fullWidth
            size="medium"
            disabled={loading || unavailableClaim}
            onClick={handleClaim}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            <Trans>Withdraw</Trans>
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

type Reclaim = {
  token: string;
  token0: string;
  token1: string;
  poolId: string;
  balance: bigint;
  type: "unDeposit" | "unUsed";
};

interface ReclaimItemsProps {
  balance: Reclaim;
  updateUnavailableKeys: (key: number) => void;
  updateClaimedKey: (key: number) => void;
  claimedKey: number;
  claimedKeys: number[];
}

export function ReclaimItems({
  balance,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
}: ReclaimItemsProps) {
  const { result: token0 } = useTokenInfo(balance.token0);
  const { result: token1 } = useTokenInfo(balance.token1);

  const token = useMemo(() => {
    if (!token0 || !token1) return undefined;
    return balance.token === token0.canisterId ? token0 : token1;
  }, [token0, token1, balance]);

  const name = token0 && token1 ? `${token0.symbol}/${token1.symbol}` : "--";

  return token ? (
    <ReclaimItem
      claimedKey={claimedKey}
      poolId={balance.poolId}
      token={token}
      name={name}
      balance={balance.balance}
      type={balance.type}
      updateUnavailableKeys={updateUnavailableKeys}
      updateClaimedKey={updateClaimedKey}
      claimedKeys={claimedKeys}
    />
  ) : null;
}
