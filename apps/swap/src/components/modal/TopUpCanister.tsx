import React, { useState, useMemo } from "react";
import { Grid, InputAdornment, Typography, Box } from "@mui/material";
import { NumberTextField, AuthButton } from "components/index";
import { cycleValueFormat, formatTokenAmount, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import { useICP2CyclesManager } from "store/global/hooks";
import { CYCLES_MINTING_CANISTER_ID } from "constants/index";
import { Principal } from "@dfinity/principal";
import { useAccountPrincipal } from "store/auth/hooks";
import MaxButton from "components/MaxButton";
import { tokenTransfer } from "hooks/token/calls";
import { ledgerService } from "actor/index";
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { useTokenBalance } from "@icpswap/hooks";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";
import { useTranslation } from "react-i18next";

import Modal from "./index";

export interface TopUpCanisterProps {
  canisterId: string;
  cyclesBalance: string | number | bigint;
  open: boolean;
  onClose: () => void;
  onTopUpSuccess?: () => void;
}

export default function TopUpCanister({
  canisterId,
  cyclesBalance,
  open,
  onClose,
  onTopUpSuccess,
}: TopUpCanisterProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | string>("");
  const principal = useAccountPrincipal();
  const ICP2Cycles = useICP2CyclesManager();
  const { result: ICPBalance } = useTokenBalance({ canisterId: ICP_TOKEN_INFO.canisterId, address: principal });
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const balance = useMemo(() => {
    return parseTokenAmount(ICPBalance, ICP_TOKEN_INFO.decimals).toString();
  }, [ICPBalance]);

  const handleTopUpCanister = async () => {
    openFullscreenLoading();

    const TopUpCanisterPrincipal = Principal.fromText(canisterId);
    const CyclesMintingPrincipal = Principal.fromText(CYCLES_MINTING_CANISTER_ID);

    if (principal) {
      const to = AccountIdentifier.fromPrincipal({
        principal: CyclesMintingPrincipal,
        subAccount: SubAccount.fromPrincipal(TopUpCanisterPrincipal),
      }).toHex();

      try {
        const { data: blockHeight } = await tokenTransfer({
          from: principal.toString(),
          canisterId: ICP_TOKEN_INFO.canisterId,
          to,
          memo: BigInt("0x50555054"),
          amount: formatTokenAmount(amount, ICP_TOKEN_INFO.decimals).minus(
            // need double transfer fee
            formatTokenAmount(0.0002, ICP_TOKEN_INFO.decimals),
          ),
          decimals: ICP_TOKEN_INFO.decimals,
        });

        if (blockHeight) {
          await (
            await ledgerService(true)
          ).notify_dfx({
            to_canister: Principal.fromText(CYCLES_MINTING_CANISTER_ID),
            block_height: blockHeight,
            max_fee: { e8s: BigInt(0.0001 * 10 ** 8) },
            to_subaccount: [[...SubAccount.fromPrincipal(TopUpCanisterPrincipal).toUint8Array()]],
            from_subaccount: [],
          });

          if (onTopUpSuccess) onTopUpSuccess();

          openSuccessTip(t`Top-up successfully`);
        } else {
          openErrorTip(t`Failed to top-up`);
        }
      } catch (err) {
        openErrorTip(t`Failed to top-up`);
        console.error(err);
      }
    } else {
      console.error("No http agent founded");
    }

    closeFullscreenLoading();
  };

  const topUpCycles = useMemo(() => {
    if (!amount || !ICP2Cycles) return 0;
    if (!new BigNumber(amount).minus(0.0002).isGreaterThan(0)) return 0;
    return new BigNumber(new BigNumber(amount).minus(0.0002).multipliedBy(ICP2Cycles).toFixed(4)).toFormat();
  }, [amount, ICP2Cycles]);

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();
    if (balance) {
      setAmount(balance);
    }
  };

  let ErrorMessage = "";
  if (new BigNumber(amount).minus(balance ?? 0).toNumber() > 0) ErrorMessage = t("common.error.insufficient.balance");
  if (!new BigNumber(amount).isGreaterThan(0.0002))
    ErrorMessage = t("common.error.amount.greater.than", { amount: "0.0002" });
  if (!amount) ErrorMessage = t("common.error.");

  return (
    <Modal title={t`Top-up canister`} open={open} onClose={onClose}>
      <NumberTextField
        name="amount"
        label={t("common.amount")}
        value={amount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAmount(event.target.value);
        }}
        fullWidth
        numericProps={{
          decimalScale: Number(ICP_TOKEN_INFO.decimals),
          allowNegative: false,
          maxLength: 15,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography>{`${topUpCycles} T Cycles`}</Typography>
            </InputAdornment>
          ),
        }}
      />

      <Box mt={1}>
        <Grid container alignItems="center">
          <Typography>Balance: {`${new BigNumber(balance).toFormat()} ICP`}</Typography>
          <MaxButton
            sx={{
              marginLeft: "6px",
            }}
            onClick={handleMax}
          />
        </Grid>

        <Box mt={1}>
          <Typography>
            {t("wallet.topUp.canister.available")}
            {`${cycleValueFormat(cyclesBalance)} Cycles`}
          </Typography>
        </Box>
      </Box>

      <Box mt={2}>
        <AuthButton
          variant="contained"
          sx={{ my: 3 }}
          fullWidth
          color="primary"
          type="submit"
          size="large"
          disabled={!!ErrorMessage}
          onClick={handleTopUpCanister}
        >
          {ErrorMessage || t("common.topUp")}
        </AuthButton>
      </Box>
    </Modal>
  );
}
