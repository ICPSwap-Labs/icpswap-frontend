import { useState, useMemo, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import { Typography, Box, Grid, Button, CircularProgress, Avatar, Checkbox } from "@mui/material";
import { useTheme } from "@mui/styles";
import { NoData, LoadingRow, Wrapper, Breadcrumbs, SwapTooltip, SelectToken } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { useUserSwapPoolBalances } from "@icpswap/hooks";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { withdraw, deposit } from "hooks/swap/v3Calls";
// import { useHistory } from "react-router-dom";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ICP } from "constants/tokens";

interface BalanceItemProps {
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

export function BalanceItem({
  token,
  balance,
  name,
  poolId,
  type,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
}: BalanceItemProps) {
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
      `Reclaim your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    let amount = balance;

    if (amount !== BigInt(0)) {
      if (type === "unDeposit") {
        const result = await deposit(true, poolId, token.canisterId, amount, token.transFee);

        if (result.status === ResultStatus.OK) {
          const result = await withdraw(true, poolId, token.canisterId, token.transFee, amount - token.transFee);
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
        const result = await withdraw(true, poolId, token.canisterId, token.transFee, amount);

        if (result.status === ResultStatus.OK) {
          openTip(`Withdrew ${name} ${token?.symbol} successfully`, MessageTypes.success);
          updateClaimedKey(claimedKey);
        } else {
          openTip(!!result.message ? result.message : `Failed to Withdraw ${name} ${token.symbol}`, MessageTypes.error);
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
            <SwapTooltip tips="Claim amount is below the transaction fee, making it unclaimable." iconSize="24px" />
          ) : null}

          <Button
            variant="contained"
            fullWidth
            size="medium"
            disabled={loading || unavailableClaim}
            onClick={handleClaim}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            <Trans>Reclaim</Trans>
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

interface BalancesItemProps {
  balance: Balance;
  updateUnavailableKeys: (key: number) => void;
  updateClaimedKey: (key: number) => void;
  claimedKey: number;
  claimedKeys: number[];
}

export function BalancesItem({
  balance,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
}: BalancesItemProps) {
  const { result: token0 } = useTokenInfo(balance.token0);
  const { result: token1 } = useTokenInfo(balance.token1);

  const token = useMemo(() => {
    if (!token0 || !token1) return undefined;
    return balance.token === token0.canisterId ? token0 : token1;
  }, [token0, token1, balance]);

  const name = token0 && token1 ? `${token0.symbol}/${token1.symbol}` : "--";

  return token ? (
    <BalanceItem
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

type Balance = {
  token: string;
  token0: string;
  token1: string;
  poolId: string;
  balance: bigint;
  type: "unDeposit" | "unUsed";
};

export default function SwapReclaim() {
  const principal = useAccountPrincipalString();
  const [selectedTokenId, setSelectedTokenId] = useState<string>(ICP.address);

  const { pools, loading, balances } = useUserSwapPoolBalances(principal, selectedTokenId);
  const [unavailableClaimKeys, setUnavailableClaimKeys] = useState<number[]>([]);
  const [claimedKeys, setClaimedKeys] = useState<number[]>([]);

  const _balances = useMemo(() => {
    if (!balances) return [];

    return balances
      .filter((balance) => balance.balance0 !== BigInt(0) || balance.balance1 !== BigInt(0))
      .reduce((prev, curr) => {
        const arr = [...prev];
        const poolId = curr.canisterId.toString();

        if (curr.balance0 !== BigInt(0))
          arr.push({
            token: curr.token0.address,
            balance: curr.balance0,
            poolId,
            type: curr.type,
            token0: curr.token0.address,
            token1: curr.token1.address,
          } as Balance);
        if (curr.balance1 !== BigInt(0))
          arr.push({
            token: curr.token1.address,
            balance: curr.balance1,
            poolId,
            type: curr.type,
            token0: curr.token0.address,
            token1: curr.token1.address,
          } as Balance);

        return arr;
      }, [] as Balance[]);
  }, [pools, balances]);

  const totalClaimedNumbers = useMemo(() => {
    return _balances.length;
  }, [_balances]);

  const { hideUnavailableClaim, updateHideUnavailableClaim } = useHideUnavailableClaimManager();

  // const handleFindToken = () => {
  //   history.push("/swap/find-mis-transferred-token");
  // };

  const handleToggleUnclaim = () => {
    updateHideUnavailableClaim(!hideUnavailableClaim);
  };

  const handleUpdateUnavailableKeys = (key: number) => {
    setUnavailableClaimKeys((prevState) => [...new Set([...prevState, key])]);
  };

  const handleUpdateClaimedKey = (index: number) => {
    setClaimedKeys((prevState) => [...prevState, index]);
  };

  const unavailableClaimNumbers = useMemo(() => {
    return unavailableClaimKeys.length;
  }, [unavailableClaimKeys]);

  const no_data = useMemo(() => {
    if (totalClaimedNumbers === 0) return true;
    if (unavailableClaimNumbers === totalClaimedNumbers) return hideUnavailableClaim;
    if (unavailableClaimNumbers === 0) return claimedKeys.length === totalClaimedNumbers;
    return unavailableClaimNumbers + claimedKeys.length === totalClaimedNumbers && hideUnavailableClaim;
  }, [claimedKeys, unavailableClaimNumbers, totalClaimedNumbers, hideUnavailableClaim]);

  const handleTokenChange = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  return (
    <Wrapper>
      <Box sx={{ margin: "10px 0 0 0" }}>
        <Breadcrumbs
          prevLink="/swap"
          prevLabel={<Trans>Swap</Trans>}
          currentLabel={<Trans>Reclaim Your Tokens</Trans>}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
            <Trans>Reclaim Your Tokens</Trans>
          </Typography>

          <Typography sx={{ margin: "10px 0 0 0" }}>
            <Trans>
              For your funds' safety on ICPSwap and to make it more convenient for you to reclaim your tokens, we've
              implemented the 'Reclaim Your Tokens feature. You can use this feature in case of issues during swaps,
              liquidity withdrawals/additions, fee claims, or transaction failures due to significant slippage. It
              allows you to retrieve and reclaim your tokens when issues occur!
            </Trans>
          </Typography>

          <Typography sx={{ margin: "20px 0 0 0" }}>
            <Trans>
              When might issues occur: Such as network latency or stutter, page refreshing during the Swap, excessive
              slippage, significant token price fluctuations, and so on.
            </Trans>
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "32px 0 0 0",
              alignItems: "center",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "20px 0",
                alignItems: "flex-start",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0 10px",
                "@media(max-width: 640px)": {
                  alignItems: "center",
                },
              }}
            >
              <Typography color="text.primary">
                <Trans>Select Token</Trans>
              </Typography>

              <Box sx={{ minWidth: "200px" }}>
                <SelectToken search value={selectedTokenId} border onTokenChange={handleTokenChange} />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "@media(max-width: 640px)": {
                  justifyContent: "flex-end",
                  width: "100%",
                },
              }}
            >
              <Box
                sx={{ display: "flex", gap: "0 5px", alignItems: "center", cursor: "pointer", width: "fit-content" }}
                onClick={handleToggleUnclaim}
              >
                <Checkbox
                  checked={hideUnavailableClaim}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    updateHideUnavailableClaim(checked);
                  }}
                />

                <Typography sx={{ userSelect: "none" }}>
                  <Trans>Hide unclaimable tokens.</Trans>
                </Typography>
              </Box>
            </Box>
          </Box>

          {selectedTokenId === ICP.address ? (
            <Box sx={{ margin: "10px 0 0 0", display: "flex", gap: "0 5px", alignItems: "center" }}>
              <Typography>
                <Trans>
                  Selecting ICP may require querying all trading pairs associated with it, leading to longer wait times.
                  This process could take approximately 2-3 minutes. Please be patient.
                </Trans>
              </Typography>
            </Box>
          ) : null}

          {/* <Box sx={{ margin: "30px 0 0 0", display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Typography color="text.orangeWarning">
              <Trans>If you still haven’t been able to reclaim your tokens, please click</Trans>
            </Typography>

            <Button variant="outlined" size="small" onClick={handleFindToken}>
              <Trans>Retrieve Your Tokens</Trans>
            </Button>
          </Box> */}

          <Box sx={{ margin: "20px 0 0 0" }}>
            {loading ? (
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
            ) : no_data ? (
              <NoData />
            ) : (
              <Box
                sx={{
                  overflow: "auto",
                  margin: "-16px 0 0 0",
                }}
              >
                {_balances.map((balance, index) => (
                  <BalancesItem
                    key={index}
                    balance={balance}
                    claimedKey={index}
                    updateUnavailableKeys={handleUpdateUnavailableKeys}
                    updateClaimedKey={handleUpdateClaimedKey}
                    claimedKeys={claimedKeys}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
}
