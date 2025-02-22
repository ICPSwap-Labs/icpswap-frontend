import { ReactNode, useState } from "react";
import { Box, Typography } from "components/Mui";
import isFunction from "lodash/isFunction";
import Identity, { CallbackProps } from "components/Identity";
import { Identity as AuthIdentity, ResultStatus } from "types";
import { wrapICP } from "hooks/useWICPCalls";
import { useSuccessTip, useErrorTip, useFullscreenLoading } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { TextButton, Modal, AuthButton, NumberFilledTextField } from "components/index";
import { useAccount } from "store/auth/hooks";
import isNumber from "lodash/isNumber";
import { useTranslation } from "react-i18next";

export default function RetryWrap({
  children,
  onRetrySuccess,
}: {
  children: ReactNode | ((val: any) => JSX.Element);
  onRetrySuccess: () => void;
}) {
  const { t } = useTranslation();
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

    if (!blockHeight || !account) return;

    const { status, message } = await wrapICP(identity, {
      to: { address: account },
      blockHeight: BigInt(blockHeight),
    });

    closeFullscreenLoading();

    if (status === ResultStatus.OK) {
      openSuccessTip(t("wrap.success"));
      onRetrySuccess();
      setOpen(false);
      setBlockHeight(null);
    } else {
      openErrorTip(getLocaleMessage(message) ?? t("wrap.failed.error"));
    }
  };

  let errorMessage = "";
  if (!isNumber(Number(blockHeight))) errorMessage = t("wrap.error.invalid.block");
  if (!blockHeight) errorMessage = t`Enter the block height`;

  return (
    <>
      {isFunction(children) ? children({ onClick }) : children}
      {open ? (
        <Modal title={t("wrap.retry")} open={open} onClose={handleClose}>
          <Box>
            <Typography component="span">{t("wrap.retry.descriptions")}</Typography>
            {account ? (
              <TextButton link={`https://dashboard.internetcomputer.org/account/${account}`}>
                {t("wrap.view.explorer")}
              </TextButton>
            ) : null}
          </Box>
          <Box mt={3}>
            <NumberFilledTextField
              placeholder={t`Please enter the block height of your failed wrap`}
              value={blockHeight}
              onChange={setBlockHeight}
              numericProps={{
                allowNegative: false,
                decimalScale: 0,
                maxLength: 16,
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
                  {errorMessage || t("common.retry")}
                </AuthButton>
              )}
            </Identity>
          </Box>
        </Modal>
      ) : null}
    </>
  );
}
