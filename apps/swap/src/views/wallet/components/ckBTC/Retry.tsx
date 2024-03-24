import { useState } from "react";
import Modal from "components/modal/index";
import { Typography, Box, Button, CircularProgress } from "@mui/material";
import { numberToString, parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity/index";
import { useTips, MessageTypes } from "hooks/useTips";
import { DISSOLVE_FEE } from "constants/ckBTC";
import FilledTextField from "components/FilledTextField";
import { retrieveBTCv1 } from "hooks/ck-btc/useRetrieve";
import { useUpdateUserTx } from "store/wallet/hooks";
import { TokenInfo } from "types/token";
import { validate } from "bitcoin-address-validation";
import { useAccountPrincipal } from "store/auth/hooks";
import BigNumber from "bignumber.js";

export interface RetryDissolveProps {
  open: boolean;
  onClose: () => void;
  unDissolveBalance: BigNumber | undefined;
  token: TokenInfo | undefined;
}

export default function RetryDissolve({ open, onClose = () => {}, unDissolveBalance, token }: RetryDissolveProps) {
  const principal = useAccountPrincipal();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [openTip] = useTips();

  const updateUserTx = useUpdateUserTx();

  const handleSubmit = async () => {
    if (!unDissolveBalance || !token || !address || !principal) return;

    const _amount = unDissolveBalance;

    setLoading(true);

    const { status, message, data } = await retrieveBTCv1(address, BigInt(numberToString(_amount)));

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to dissolve`, MessageTypes.error);
    } else {
      openTip("Dissolve successfully", MessageTypes.success);
      if (data?.block_index) {
        updateUserTx(principal.toString(), data.block_index, undefined, numberToString(_amount));
      }

      setAddress(undefined);

      onClose();
    }

    setLoading(false);
  };

  let error = "";
  if (address && !validate(address)) error = t`Invalid bitcoin address`;
  if (unDissolveBalance && !unDissolveBalance.isGreaterThan(0.001)) error = t`Min amount is 0.001 ckBTC`;
  if (!address) error = t`Enter the address`;

  return (
    <Modal open={open} title={t`Retry your dissolution`} onClose={onClose}>
      <Box>
        <Typography sx={{ margin: "10px 0 0 0" }}>
          <Trans>Amount: (includes bitcoin network fees)</Trans>
        </Typography>

        <Box sx={{ margin: "15px 0 0 0" }}>
          <FilledTextField
            value={
              !!unDissolveBalance && !!token ? parseTokenAmount(unDissolveBalance, token.decimals).toFormat() : "--"
            }
            disabled
          />
        </Box>

        <Typography sx={{ margin: "20px 0 0 0" }}>
          <Typography component="span" color="#D3625B">
            *
          </Typography>
          <Trans>Address:</Trans>
        </Typography>

        <Box sx={{ margin: "15px 0 0 0" }}>
          <FilledTextField
            value={address}
            onChange={(value) => setAddress(value)}
            inputProps={{
              maxLength: 255,
            }}
          />
        </Box>

        <Box sx={{ margin: "15px 0 0 0" }}>
          <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
            <Typography component="div">
              <Typography>Dissolve Fee: {DISSOLVE_FEE}ckBTC</Typography>
              <Typography>
                <Trans>(Excludes Bitcoin Network Tx fees)</Trans>
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ width: "100%", margin: "20px 0 0 0" }}>
            <Identity onSubmit={handleSubmit}>
              {({ submit }: CallbackProps) => (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submit}
                  disabled={!!error || loading || !unDissolveBalance}
                >
                  {loading ? <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }} /> : null}
                  {error ? error : <Trans>Dissolve ckBTC</Trans>}
                </Button>
              )}
            </Identity>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
