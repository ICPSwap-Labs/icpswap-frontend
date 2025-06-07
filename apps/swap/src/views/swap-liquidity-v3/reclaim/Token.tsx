import { useState, useMemo, useEffect } from "react";
import { Typography, Box, Checkbox } from "components/Mui";
import { NoData, LoadingRow, SelectToken } from "components/index";
import { useUserSwapPoolBalances, useParsedQueryString } from "@icpswap/hooks";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ICP } from "@icpswap/tokens";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
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

export function ReclaimWithToken() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const history = useHistory();
  const { tokenId: tokenIdFromUrl } = useParsedQueryString() as { tokenId: string };

  const [tokenId, setTokenId] = useState<string | undefined>(undefined);

  const { loading, balances } = useUserSwapPoolBalances({ principal, tokenId });
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

  const handleTokenChange = (tokenId: string) => {
    if (tokenId) {
      history.push(`/swap/withdraw?type=token&tokenId=${tokenId}`);
    } else {
      history.push(`/swap/withdraw?type=token`);
    }
  };

  useEffect(() => {
    setTokenId(tokenIdFromUrl ?? ICP.address);
  }, [tokenIdFromUrl]);

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
          <Box sx={{ minWidth: "200px" }}>
            <SelectToken search value={tokenId} border onTokenChange={handleTokenChange} showClean={false} />
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

            <Typography sx={{ userSelect: "none" }}>{t("swap.reclaim.hide.tokens")}</Typography>
          </Box>
        </Box>
      </Box>

      {tokenId === ICP.address && !isMobile ? (
        <Box sx={{ margin: "10px 0 0 0", display: "flex", gap: "0 5px", alignItems: "center" }}>
          <Typography lineHeight="18px">{t("reclaim.select.token.description")}</Typography>
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
          <NoData tip={t("swap.reclaim.empty")} />
        ) : (
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
        )}
      </Box>
    </>
  );
}
