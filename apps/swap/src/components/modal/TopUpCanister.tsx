import React, { useState, useMemo } from "react";
import { Grid, InputAdornment, Typography, Box } from "@mui/material";
import { NumberTextField } from "components/index";
import Modal from "./index";
import { cycleValueFormat, formatTokenAmount, parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import { useICP2CyclesManager } from "store/global/hooks";
import { t, Trans } from "@lingui/macro";
import { CYCLES_MINTING_CANISTER_ID, ICP, ICP_TOKEN_INFO } from "constants/index";
import { Principal } from "@dfinity/principal";
import Identity, { Submit } from "components/Identity";
import { Identity as CallIdentity } from "types/index";
import { useAccountPrincipal } from "store/auth/hooks";
import Button from "components/authentication/ButtonConnector";
import MaxButton from "components/MaxButton";
import { tokenTransfer } from "hooks/token/calls";
import { ledgerService } from "actor/index";
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { useTokenBalance } from "@icpswap/hooks";

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

  const handleTopUpCanister = async (identity: CallIdentity) => {
    openFullscreenLoading();

    const TopUpCanisterPrincipal = Principal.fromText(canisterId);
    const CyclesMintingPrincipal = Principal.fromText(CYCLES_MINTING_CANISTER_ID);

    if (identity && !!principal) {
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
          identity,
        });

        if (blockHeight) {
          await (
            await ledgerService(identity)
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
        console.log(err);
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
  if (new BigNumber(amount).minus(balance ?? 0).toNumber() > 0) ErrorMessage = t`Insufficient Balance`;
  if (!new BigNumber(amount).isGreaterThan(0.0002)) ErrorMessage = t`Amount must be greater than 0.0002`;
  if (!amount) ErrorMessage = t`Enter an amount`;

  return (
    <Modal title={t`Top-up canister`} open={open} onClose={onClose}>
      <NumberTextField
        name="amount"
        label={t`Amount *`}
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
            <Trans>Canister Available:</Trans>
            {`${cycleValueFormat(cyclesBalance)} Cycles`}
          </Typography>
        </Box>
      </Box>

      <Box mt={2}>
        <Identity onSubmit={handleTopUpCanister}>
          {({ submit }: { submit: Submit }) => (
            <Button
              variant="contained"
              sx={{ my: 3 }}
              fullWidth
              color="primary"
              type="submit"
              size="large"
              disabled={!!ErrorMessage}
              onClick={submit}
            >
              {ErrorMessage ? ErrorMessage : <Trans>Top up</Trans>}
            </Button>
          )}
        </Identity>
      </Box>
    </Modal>
  );
}
