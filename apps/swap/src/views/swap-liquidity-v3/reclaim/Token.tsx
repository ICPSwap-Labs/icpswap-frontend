import { useState, useMemo } from "react";
import { Typography, Box, Checkbox } from "@mui/material";
import { NoData, LoadingRow, SelectToken } from "components/index";
import { Trans } from "@lingui/macro";
import { useUserSwapPoolBalances } from "@icpswap/hooks";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ICP } from "constants/tokens";
import { AlertCircle } from "react-feather";
import { isMobile } from "react-device-detect";

import { ReclaimItems } from "./components/ReclaimItem";

type Balance = {
  token: string;
  token0: string;
  token1: string;
  poolId: string;
  balance: bigint;
  type: "unDeposit" | "unUsed";
};

export function ReclaimWithToken() {
  const principal = useAccountPrincipalString();
  const [selectedTokenId, setSelectedTokenId] = useState<string>(ICP.address);
  const [showTips, setShowTips] = useState(false);

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

  const handleShowTips = () => {
    setShowTips(!showTips);
  };

  return (
    <>
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
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px 0",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
            <Typography color="text.primary">
              <Trans>Select Token</Trans>
            </Typography>

            {isMobile ? <AlertCircle size="16px" onClick={handleShowTips} /> : null}
          </Box>

          <Box sx={{ minWidth: "200px" }}>
            <SelectToken search value={selectedTokenId} border onTokenChange={handleTokenChange} />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "@media(max-width: 640px)": {
              justifyContent: "flex-start",
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

      {selectedTokenId === ICP.address && (showTips || !isMobile) ? (
        <Box sx={{ margin: "10px 0 0 0", display: "flex", gap: "0 5px", alignItems: "center" }}>
          <Typography>
            <Trans>
              Selecting ICP may require querying all trading pairs associated with it, leading to longer wait times.
              This process could take approximately 2-3 minutes. Please be patient.
            </Trans>
          </Typography>
        </Box>
      ) : null}

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
              <ReclaimItems
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
    </>
  );
}
