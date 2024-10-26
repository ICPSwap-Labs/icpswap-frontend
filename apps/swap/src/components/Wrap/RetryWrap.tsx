import { ReactNode, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import isFunction from "lodash/isFunction";
import Identity, { CallbackProps } from "components/Identity";
import { Identity as AuthIdentity, ResultStatus } from "types";
import { wrapICP } from "hooks/useWICPCalls";
import { useSuccessTip, useErrorTip, useFullscreenLoading } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import { TextButton, TextFieldNumberComponent, FilledTextField, Modal, AuthButton } from "components/index";
import { useAccount } from "store/global/hooks";
import isNumber from "lodash/isNumber";

export default function RetryWrap({
  children,
  onRetrySuccess,
}: {
  children: ReactNode | ((val: any) => JSX.Element);
  onRetrySuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [blockHeight, setBlockHeight] = useState<null | bigint>(null);
  const account = useAccount();
  const [openFullscreenLoading, closeFullscreenLoading, loading] = useFullscreenLoading();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const handleClose = () => {
    setOpen(false);
    setBlockHeight(null);
  };

  const onClick = () => {
    setOpen(true);
  };

  const handleWrap = async (identity: AuthIdentity) => {
    openFullscreenLoading();

    if (!blockHeight) return;

    const { status, message } = await wrapICP(identity, {
      to: { address: account },
      blockHeight: BigInt(blockHeight),
    });

    closeFullscreenLoading();

    if (status === ResultStatus.OK) {
      openSuccessTip(t`Wrapped successfully`);
      onRetrySuccess();
      setOpen(false);
      setBlockHeight(null);
    } else {
      openErrorTip(getLocaleMessage(message) ?? t`Failed to wrap`);
    }
  };

  let errorMessage = "";
  if (!isNumber(Number(blockHeight))) errorMessage = t`Invalid block height`;
  if (!blockHeight) errorMessage = t`Enter the block height`;

  return (
    <>
      {isFunction(children) ? children({ onClick }) : children}
      {open ? (
        <Modal title={t`Retry Wrap`} open={open} onClose={handleClose}>
          <Box>
            <Typography component="span">
              <Trans>You can retry when your WICP have not transferred to your wallet address after your wrap.</Trans>
            </Typography>
            {account ? (
              <TextButton link={`https://dashboard.internetcomputer.org/account/${account}`}>
                <Trans>View Account in Explore</Trans>
              </TextButton>
            ) : null}
          </Box>
          <Box mt={3}>
            <FilledTextField
              label={t`Transaction Block Height`}
              placeholder={t`Please enter the block height of your failed wrap`}
              value={blockHeight}
              onChange={setBlockHeight}
              InputProps={{
                inputComponent: TextFieldNumberComponent,
                inputProps: {
                  allowNegative: false,
                  decimalScale: 0,
                  maxLength: 16,
                },
              }}
            />
          </Box>
          <Box mt={5}>
            <Identity onSubmit={handleWrap}>
              {({ submit }: CallbackProps) => (
                <AuthButton
                  fullWidth
                  disabled={!blockHeight || loading || !!errorMessage}
                  variant="contained"
                  size="large"
                  onClick={submit}
                >
                  {errorMessage || <Trans>Retry</Trans>}
                </AuthButton>
              )}
            </Identity>
          </Box>
        </Modal>
      ) : null}
    </>
  );
}
