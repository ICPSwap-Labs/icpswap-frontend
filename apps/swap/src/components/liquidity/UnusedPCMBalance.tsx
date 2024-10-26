import { useCallback, useMemo } from "react";
import { Typography, Button, CircularProgress, Box } from "components/Mui";
import { Trans, t } from "@lingui/macro";
import { Flex, Tooltip } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { toSignificantWithGroupSeparator, parseTokenAmount, nonNullArgs, isNullArgs, BigNumber } from "@icpswap/utils";
import { useUserPCMBalance, usePCMMetadata } from "@icpswap/hooks";
import { useTokenInfo } from "hooks/token";
import { useWithdrawPCMBalanceCallback, useUserPassCodes, WithdrawPCMBalanceArgs } from "hooks/swap/index";
import { useRefreshTrigger, useGlobalContext } from "hooks/index";

const TRIGGER_KEY = "UNUSED_PCM_BALANCE";

export interface UnusedPCMBalanceProps {
  className?: string;
}

export function UnusedPCMBalance({ className }: UnusedPCMBalanceProps) {
  const principal = useAccountPrincipal();
  const { setRefreshTriggers } = useGlobalContext();
  const refreshTrigger = useRefreshTrigger(TRIGGER_KEY);

  const { result: unusedPCMBalance } = useUserPCMBalance(principal, refreshTrigger);
  const { result: pcmMetadata } = usePCMMetadata();
  const { result: pcmToken } = useTokenInfo(pcmMetadata?.tokenCid.toString());
  const { result: passCodes } = useUserPassCodes(refreshTrigger);

  const { callback: withdrawPCMBalance, loading: withdrawPCMBalanceLoading } = useWithdrawPCMBalanceCallback();

  const handleWithdrawPCMBalance = useCallback(async () => {
    if (isNullArgs(unusedPCMBalance) || !pcmToken || isNullArgs(pcmMetadata) || isNullArgs(passCodes)) return;

    const args = [
      {
        token: pcmToken,
        name: pcmToken.name,
        type: "unUsed",
        metadata: pcmMetadata,
        amount: unusedPCMBalance,
      },
      ...passCodes.map((code) => ({
        token: pcmToken,
        name: pcmToken.name,
        type: "code",
        metadata: pcmMetadata,
        code,
        amount: pcmMetadata.passcodePrice,
      })),
    ] as WithdrawPCMBalanceArgs[];

    await withdrawPCMBalance(args);

    setRefreshTriggers(TRIGGER_KEY);
  }, [unusedPCMBalance, pcmToken, pcmMetadata, passCodes]);

  const totalTokenAmount = useMemo(() => {
    if (isNullArgs(unusedPCMBalance) || isNullArgs(pcmToken) || isNullArgs(passCodes) || isNullArgs(pcmMetadata))
      return undefined;

    return new BigNumber(unusedPCMBalance.toString()).plus(
      new BigNumber(pcmMetadata.passcodePrice.toString()).multipliedBy(passCodes.length),
    );
  }, [pcmMetadata, pcmToken, passCodes, unusedPCMBalance]);

  return (
    <Box sx={{ width: "260px" }}>
      <Flex gap="0 4px">
        <Typography>
          <Trans>Unused {pcmToken ? pcmToken.symbol : "--"}</Trans>
        </Typography>
        <Tooltip tips={t`ICP fee wasn't used because of the failed pool creation.`} />
      </Flex>

      <Flex gap="0 8px" sx={{ margin: "15px 0 0 0" }}>
        <Typography className={className}>
          {pcmToken && nonNullArgs(totalTokenAmount)
            ? `${toSignificantWithGroupSeparator(parseTokenAmount(totalTokenAmount, pcmToken.decimals).toString())} ${
                pcmToken.symbol
              }`
            : "--"}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleWithdrawPCMBalance}
          startIcon={withdrawPCMBalanceLoading ? <CircularProgress color="inherit" size={16} /> : null}
          disabled={withdrawPCMBalanceLoading || isNullArgs(totalTokenAmount) || totalTokenAmount.isEqualTo(0)}
        >
          <Trans>Withdraw</Trans>
        </Button>
      </Flex>
    </Box>
  );
}
