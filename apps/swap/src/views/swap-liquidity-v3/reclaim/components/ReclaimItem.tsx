import { useState, useMemo, useEffect } from "react";
import { Typography, Box, Button, CircularProgress, Avatar, useTheme } from "components/Mui";
import { Tooltip, Flex } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { useToken } from "hooks/index";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useReclaim } from "hooks/swap/useReclaim";
import { Token } from "@icpswap/swap-sdk";

interface ReclaimItemProps {
  poolId: string;
  border?: boolean;
  token: Token;
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
  const theme = useTheme();
  const { hideUnavailableClaim } = useHideUnavailableClaimManager();

  const [loading, setLoading] = useState<boolean>(false);

  const unavailableClaim = type === "unDeposit" ? balance < token.transFee * 2 : balance < token.transFee;

  const reclaim = useReclaim();

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

    await reclaim({
      token,
      poolId,
      type,
      balance,
    });

    updateClaimedKey(claimedKey);

    setLoading(false);
  };

  return (
    <Flex
      fullWidth
      align="center"
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
    </Flex>
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
  const [, token0] = useToken(balance.token0);
  const [, token1] = useToken(balance.token1);

  const token = useMemo(() => {
    if (!token0 || !token1) return undefined;
    return balance.token === token0.address ? token0 : token1;
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
