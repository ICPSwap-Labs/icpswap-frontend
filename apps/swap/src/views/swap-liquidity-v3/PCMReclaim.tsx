import { useState, useMemo, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import { Typography, Box, Grid, Button, CircularProgress, Avatar } from "@mui/material";
import { useTheme } from "@mui/styles";
import { NoData, LoadingRow, Wrapper, Breadcrumbs, Tooltip } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { useHideUnavailableClaimManager } from "store/customization/hooks";
import { useUserPCMBalance, usePassCode, usePCMMetadata, destroyPassCode, withdrawPCMBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { type PassCode, type PCMMetadata, ResultStatus } from "@icpswap/types";

type ClaimedKey = string | number;

interface BalanceItemProps {
  border?: boolean;
  token: TokenInfo;
  name: string | undefined;
  type: "code" | "unUsed";
  balance: bigint | undefined;
  updateUnavailableKeys: (key: ClaimedKey) => void;
  updateClaimedKey: (key: ClaimedKey) => void;
  claimedKey: ClaimedKey;
  claimedKeys: ClaimedKey[];
  metadata: PCMMetadata | undefined | null;
  code: PassCode | undefined;
}

export function BalanceItem({
  token,
  balance,
  name,
  type,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
  metadata,
  code,
}: BalanceItemProps) {
  const theme = useTheme() as Theme;
  const { hideUnavailableClaim } = useHideUnavailableClaimManager();

  const [openTip, closeTip] = useTips();

  const [loading, setLoading] = useState<boolean>(false);

  const unavailableClaim = !balance
    ? false
    : type === "code"
    ? balance < token.transFee * BigInt(2)
    : balance < token.transFee;

  const isClaimed = useMemo(() => {
    return claimedKeys.includes(claimedKey);
  }, [claimedKeys, claimedKey]);

  useEffect(() => {
    if (unavailableClaim === true) {
      updateUnavailableKeys(claimedKey);
    }
  }, [unavailableClaim, claimedKey]);

  const handleClaim = async () => {
    if (loading || unavailableClaim || !metadata) return;

    setLoading(true);

    const loadingKey = openTip(
      `Withdraw your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    const amount = balance;

    if (!!amount && amount !== BigInt(0)) {
      if (type === "code" && !!code) {
        const result = await destroyPassCode(code.token0.toString(), code.token1.toString(), code.fee);

        if (result.status === ResultStatus.OK) {
          const result = await withdrawPCMBalance(amount, token.transFee);
          if (result.status === ResultStatus.OK) {
            openTip(`Withdrew ${name} successfully`, MessageTypes.success);
            updateClaimedKey(claimedKey);
          } else {
            openTip(`Failed to Withdraw ${name}: ${result.message}`, MessageTypes.error);
          }
        } else {
          openTip(`Failed to Withdraw: ${result.message ?? ""}`, MessageTypes.error);
        }
      } else {
        const result = await withdrawPCMBalance(amount, token.transFee);

        if (result.status === ResultStatus.OK) {
          openTip(`Withdrew ${name} successfully`, MessageTypes.success);
          updateClaimedKey(claimedKey);
        } else {
          openTip(result.message ? result.message : `Failed to Withdraw ${name}`, MessageTypes.error);
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
          {/* <Typography sx={{ margin: "4px 0 0 0" }}>{name}</Typography> */}
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

interface BalancesItemProps {
  balance?: bigint;
  code?: PassCode;
  updateUnavailableKeys: (key: ClaimedKey) => void;
  updateClaimedKey: (key: ClaimedKey) => void;
  claimedKey: ClaimedKey;
  claimedKeys: ClaimedKey[];
  metadata: PCMMetadata | undefined | null;
}

export function BalancesItem({
  balance,
  updateUnavailableKeys,
  updateClaimedKey,
  claimedKey,
  claimedKeys,
  code,
  metadata,
}: BalancesItemProps) {
  const { result: token } = useTokenInfo(metadata?.tokenCid.toString());

  const name = token ? `${token.symbol}` : "--";

  return token ? (
    <BalanceItem
      claimedKey={claimedKey}
      token={token}
      name={name}
      balance={code ? metadata?.passcodePrice : balance}
      type={code ? "code" : "unUsed"}
      updateUnavailableKeys={updateUnavailableKeys}
      updateClaimedKey={updateClaimedKey}
      claimedKeys={claimedKeys}
      metadata={metadata}
      code={code}
    />
  ) : null;
}

export default function PCMBalanceReclaim() {
  const [unavailableClaimKeys, setUnavailableClaimKeys] = useState<ClaimedKey[]>([]);
  const [claimedKeys, setClaimedKeys] = useState<ClaimedKey[]>([]);

  const handleUpdateUnavailableKeys = (key: ClaimedKey) => {
    setUnavailableClaimKeys((prevState) => [...new Set([...prevState, key])]);
  };

  const handleUpdateClaimedKey = (index: ClaimedKey) => {
    setClaimedKeys((prevState) => [...prevState, index]);
  };

  const unavailableClaimNumbers = useMemo(() => {
    return unavailableClaimKeys.length;
  }, [unavailableClaimKeys]);

  const principal = useAccountPrincipal();

  const { result: unusedBalance, loading: unUsedLoading } = useUserPCMBalance(principal);
  const { result: passCodes, loading: passLoading } = usePassCode(principal?.toString());
  const { result: pcmMetadata, loading: metadataLoading } = usePCMMetadata();

  const totalClaimedNumbers = useMemo(() => {
    return (passCodes?.length ?? 0) + (unusedBalance ? 1 : 0);
  }, [unusedBalance, passCodes]);

  const no_data = useMemo(() => {
    if (totalClaimedNumbers === 0) return true;
    if (unavailableClaimNumbers === 0) return claimedKeys.length === totalClaimedNumbers;
    return unavailableClaimNumbers + claimedKeys.length === totalClaimedNumbers;
  }, [claimedKeys, unavailableClaimNumbers, totalClaimedNumbers]);

  const loading = useMemo(() => {
    return metadataLoading || passLoading || unUsedLoading;
  }, [unUsedLoading, passLoading, metadataLoading]);

  const total_unused = useMemo(() => {
    if (!passCodes || !pcmMetadata || unusedBalance === undefined || unusedBalance === null) return undefined;
    return BigInt(passCodes.length) * pcmMetadata.passcodePrice + unusedBalance;
  }, [passCodes, pcmMetadata, unusedBalance]);

  return (
    <Wrapper>
      <Box sx={{ margin: "10px 0 0 0" }}>
        <Breadcrumbs
          prevLink="/swap"
          prevLabel={<Trans>Swap</Trans>}
          currentLabel={<Trans>Withdraw unused swap pool creation fees</Trans>}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
            <Trans>Withdraw unused swap pool creation fees</Trans>
          </Typography>

          <Typography sx={{ margin: "10px 0 0 0" }}>
            <Trans>
              Creating a Swap pool requires a payment of 1 ICP as a Swap pool creation fee. If after payment, the Swap
              pool is not created, users can withdraw the unused Swap pool creation fee.
            </Trans>
          </Typography>

          <Typography sx={{ fontSize: "16px", fontWeight: 500, margin: "20px 0 0 0" }} color="text.primary">
            <Trans>
              Total unused swap pool creation fees:{" "}
              {total_unused !== undefined ? parseTokenAmount(total_unused, 8).toFormat() : "--"}&nbsp;ICP
            </Trans>
          </Typography>

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
                {unusedBalance ? (
                  <BalancesItem
                    key="unusedBalance"
                    balance={unusedBalance}
                    claimedKey="unusedBalance"
                    updateUnavailableKeys={handleUpdateUnavailableKeys}
                    updateClaimedKey={handleUpdateClaimedKey}
                    claimedKeys={claimedKeys}
                    metadata={pcmMetadata}
                  />
                ) : null}

                {passCodes?.map((code, index) => (
                  <BalancesItem
                    key={index}
                    code={code}
                    claimedKey={index}
                    updateUnavailableKeys={handleUpdateUnavailableKeys}
                    updateClaimedKey={handleUpdateClaimedKey}
                    claimedKeys={claimedKeys}
                    metadata={pcmMetadata}
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
