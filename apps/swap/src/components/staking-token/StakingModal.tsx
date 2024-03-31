import React, { useState } from "react";
import { Button, Typography, Grid, Box, CircularProgress } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, numberToString, formatTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import Identity, { CallbackProps } from "components/Identity";
import MaxButton from "components/MaxButton";
import type { ActorIdentity, StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { Modal, NumberTextField } from "components/index";
import { isUseTransfer } from "utils/token";

export interface StakingProps {
  identity: ActorIdentity;
  token: Token;
  amount: string;
  id: string;
}

export interface StakingModalProps {
  open: boolean;
  onClose?: () => void;
  onStakingSuccess?: () => void;
  pool: StakingPoolControllerPoolInfo;
  onStaking: (args: StakingProps) => Promise<void>;
}

export default function StakingModal({ open, onClose, onStakingSuccess, pool, onStaking }: StakingModalProps) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | number | undefined>(undefined);

  const { result: _balance } = useTokenBalance(pool.stakingToken.address, principal);
  const [, token] = useToken(pool.stakingToken.address);
  const balance = parseTokenAmount(String(_balance ?? 0), token?.decimals);

  const handleSubmit = async (identity: ActorIdentity) => {
    setLoading(true);

    if (!identity || loading || !token || !principal || !amount) return;

    await onStaking({
      identity,
      token,
      amount: numberToString(formatTokenAmount(amount, token.decimals)),
      id: pool.canisterId,
    });

    setLoading(false);

    if (onStakingSuccess) onStakingSuccess();
    if (onClose) onClose();
  };

  let errorMessage = "";
  if (amount && balance && balance.isLessThan(new BigNumber(amount))) errorMessage = t`Insufficient balance`;
  if (amount && token && !parseTokenAmount(token.transFee, token.decimals).isLessThan(amount))
    errorMessage = t`Amount must be greater than trans fee`;
  if (!amount || new BigNumber(amount).isEqualTo(0)) errorMessage = t`Enter an amount`;
  if (
    amount &&
    balance &&
    token &&
    isUseTransfer(token) &&
    !formatTokenAmount(amount, token.decimals).isGreaterThan(token.transFee)
  )
    errorMessage = t`Amount must be greater than trans fee`;

  const handleMax = () => {
    if (balance && token) {
      if (!balance.isLessThan(parseTokenAmount(token.transFee, token.decimals).multipliedBy(3))) {
        setAmount(balance.minus(parseTokenAmount(token.transFee, token.decimals).multipliedBy(3)).toNumber());
      } else {
        setAmount(balance.toNumber());
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Staking`}>
      <Grid>
        <NumberTextField
          id="reward"
          name="reward"
          type="text"
          style={{ marginBottom: 6 }}
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
          defaultValue={amount}
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
            <Trans>Balance</Trans>: {balance?.toFormat()} {pool.stakingTokenSymbol}
          </Typography>

          <MaxButton
            sx={{
              marginLeft: "6px",
            }}
            onClick={handleMax}
          />
        </Grid>

        <Box mt={2}>
          <Identity onSubmit={handleSubmit}>
            {({ submit }: CallbackProps) => (
              <Button
                disabled={loading || !new BigNumber(String(balance)).toNumber() || !!errorMessage}
                variant="contained"
                fullWidth
                onClick={submit}
                size="large"
                startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
              >
                {errorMessage || t`Confirm`}
              </Button>
            )}
          </Identity>
        </Box>
      </Grid>
    </Modal>
  );
}
