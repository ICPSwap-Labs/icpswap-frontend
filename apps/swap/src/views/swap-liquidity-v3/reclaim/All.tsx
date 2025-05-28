import { useState, useMemo } from "react";
import { Typography, Box, Checkbox } from "components/Mui";
import { NoData, LoadingRow, Tooltip } from "components/index";
import { useUserSwapPoolBalances } from "@icpswap/hooks";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

import { ReclaimItems } from "./components/ReclaimItem";

type Balance = {
  token: string;
  token0: string;
  token1: string;
  poolId: string;
  balance: bigint;
  type: "unDeposit" | "unUsed";
};

export function ReclaimAll() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();

  const { loading, balances } = useUserSwapPoolBalances({ principal });
  const [unavailableClaimKeys, setUnavailableClaimKeys] = useState<number[]>([]);
  const [claimedKeys, setClaimedKeys] = useState<number[]>([]);

  const filteredBalances = useMemo(() => {
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
  }, [balances]);

  const totalClaimedNumbers = useMemo(() => {
    return filteredBalances.length;
  }, [filteredBalances]);

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
              alignItems: "center",
            },
          }}
        >
          <Typography color="text.primary">{t("common.all")}</Typography>

          {isMobile ? <Tooltip tips={t("swap.reclaim.all.description")} /> : null}
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

            <Typography sx={{ userSelect: "none" }}>{t("swap.reclaim.hide.tokens")}</Typography>
          </Box>
        </Box>
      </Box>

      {!isMobile ? (
        <Box sx={{ margin: "10px 0 0 0", display: "flex", gap: "0 5px", alignItems: "center" }}>
          <Typography sx={{ lineHeight: "18px" }}>{t("swap.reclaim.all.description")}</Typography>
        </Box>
      ) : null}

      <Box sx={{ margin: "20px 0 0 0" }}>
        {no_data && loading === false ? <NoData /> : null}

        {filteredBalances.length > 0 ? (
          <Box
            sx={{
              overflow: "auto",
              margin: "-16px 0 0 0",
            }}
          >
            {filteredBalances.map((balance, index) => (
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
        ) : null}

        {loading ? (
          <Box sx={{ margin: filteredBalances.length > 0 ? "20px 0 0 0" : "0px" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
