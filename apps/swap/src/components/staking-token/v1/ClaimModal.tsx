import React, { useMemo, useState } from "react";
import { Button, Typography, Grid, Box, CircularProgress } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { Modal, NumberTextField } from "components/index";
import { BigNumber, parseTokenAmount, formatTokenAmount } from "@icpswap/utils";
import MaxButton from "components/MaxButton";
import type { StakingPoolControllerPoolInfo } from "types/staking-token-v1";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { withdraw, useUserStakingInfo } from "hooks/staking-token/v1/calls";
import { useTips } from "hooks/useTips";
import { useAccount } from "store/global/hooks";
import { getLocaleMessage } from "locales/services";

export interface ClaimModalProps {
  open: boolean;
  onClose?: () => void;
  pool: StakingPoolControllerPoolInfo;
  onStakingSuccess?: () => void;
}

export default function ClaimModal({ open, onClose, pool, onStakingSuccess }: ClaimModalProps) {
  const account = useAccount();
  const [openTip] = useTips();

  const [userInfo] = useUserStakingInfo(pool.canisterId, pool.version, account);

  const userStakingAmount = useMemo(() => userInfo?.amount, [userInfo]);

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | number | undefined>(undefined);

  const { result: token } = useTokenInfo(pool.rewardToken.address);

  const handleSubmit = async () => {
    if (loading || !amount || !token) return;
    setLoading(true);

    const { status, message } = await withdraw(
      pool.canisterId,
      BigInt(formatTokenAmount(amount, token?.decimals).toString()),
    );

    openTip(getLocaleMessage(message), status);

    if (onStakingSuccess) onStakingSuccess();
    if (onClose) onClose();

    setLoading(false);
  };

  let errorMessage = "";
  if (amount && formatTokenAmount(amount, token?.decimals).isGreaterThan(new BigNumber(String(userStakingAmount ?? 0))))
    errorMessage = t`Insufficient balance`;
  if (!amount || new BigNumber(amount).isEqualTo(0)) errorMessage = t`Enter an amount`;

  const tokenAmount = parseTokenAmount(String(userStakingAmount ?? 0), token?.decimals);

  const handleMax = () => {
    if (tokenAmount) {
      setAmount(tokenAmount.toNumber());
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Withdraw`}>
      <Grid>
        <NumberTextField
          id="reward"
          name="reward"
          type="text"
          style={{ marginBottom: 6 }}
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
          fullWidth
          autoComplete="reward"
          numericProps={{
            decimalScale: Number(token?.decimals ?? 8),
            allowNegative: false,
            thousandSeparator: true,
          }}
        />

        <Grid container alignItems="center" sx={{ margin: "10px 0" }}>
          <Typography>
            <Trans>Staked</Trans>: {tokenAmount.toFormat()} {pool.stakingTokenSymbol}
          </Typography>

          <MaxButton
            sx={{
              marginLeft: "6px",
            }}
            onClick={handleMax}
          />
        </Grid>

        <Box mt={2}>
          <Button
            disabled={loading || !Number(userStakingAmount ?? 0) || !!errorMessage}
            variant="contained"
            fullWidth
            type="button"
            onClick={handleSubmit}
            color="primary"
            size="large"
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
          >
            {errorMessage || t`Confirm`}
          </Button>
        </Box>
      </Grid>
    </Modal>
  );
}
