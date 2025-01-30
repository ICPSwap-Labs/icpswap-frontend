import { useCallback, useState, useMemo } from "react";
import LazyImage from "components/LazyImage";
import {
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Box,
  makeStyles,
  useTheme,
  Theme,
} from "components/Mui";
import { isValidAccount, isValidPrincipal, resultFormat } from "@icpswap/utils";
import Modal from "components/modal/index";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { t, Trans } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import type { EXTCollection, ExtNft } from "@icpswap/types";
import { getLocaleMessage } from "locales/services";
import { ext_nft } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";
import { useAccountPrincipal, useAccount } from "store/auth/hooks";

const useStyles = makeStyles((theme: Theme) => {
  return {
    warningText: {
      color: theme.palette.warning.dark,
    },
    inputBox: {
      border: `1px solid #313A5A`,
      background: theme.palette.background.level4,
      borderRadius: "8px",
      padding: "14px 16px",

      "& input::placeholder": {
        color: theme.palette.primary[`400`],
      },
    },
    description: {
      fontSize: "12px",
      wordBreak: "break-all",
      maxHeight: "90px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      boxOrient: "vertical",
      lineClamp: "5",
      display: "-webkit-box",
    },
  };
});

export interface NFTTransferProps {
  open: boolean;
  onClose: () => void;
  nft: ExtNft;
  onTransferSuccess: (result: any) => void;
  image: string;
  collection: EXTCollection | undefined;
  index: number | undefined;
}

export function NFTTransfer({ image, collection, open, onClose, nft, index, onTransferSuccess }: NFTTransferProps) {
  const classes = useStyles();
  const account = useAccount();
  const theme = useTheme() as Theme;
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [to, setTo] = useState<string>("");
  const principal = useAccountPrincipal();

  const transferSubmitCallback = useCallback(
    async (identity, { loading, closeLoading }) => {
      if (loading || !principal || !to) return;

      const result = resultFormat<bigint>(
        await (
          await ext_nft(nft.canister, true)
        ).transfer({
          to: to && isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
          token: nft.id,
          notify: false,
          from: { principal },
          memo: [],
          subaccount: [],
          amount: BigInt(1),
        }),
      );

      closeLoading();

      if (result.status === "ok") {
        openSuccessTip(t`Transferred successfully`);
        if (onTransferSuccess) onTransferSuccess(result);
      } else {
        openErrorTip(getLocaleMessage(result.message));
      }
    },
    [nft, to],
  );

  const addressHelpText = useMemo(() => {
    if (account === to)
      return (
        <span className={classes.warningText}>
          <Trans>Be careful, you are transferring tokens to your own address!</Trans>
        </span>
      );

    return undefined;
  }, [account, to]);

  const handleClose = useCallback(() => {
    setTo("");
    if (onClose) onClose();
  }, [onClose, setTo]);

  const errorMsg = useMemo(() => {
    if (!to) return t`Enter account address`;
    if (!isValidAccount(to) && !isValidPrincipal(to)) return t`Invalid address`;
  }, [to]);

  return open ? (
    <Modal open={open} onClose={handleClose} title={t`NFT Transfer`}>
      <Grid
        container
        sx={{
          position: "relative",
          padding: "12px",
          background: theme.palette.background.level4,
          borderRadius: "12px",
        }}
      >
        <Grid
          item
          sx={{
            minWidth: "140px",
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "relative",
              background: theme.palette.background.level1,
              borderRadius: "8px",
              width: "100%",
              height: "100%",
            }}
          >
            <LazyImage src={image} />
          </Grid>
        </Grid>

        <Grid
          item
          xs
          sx={{
            height: "120px",
            marginLeft: "20px",
          }}
          flexDirection="column"
        >
          <Box>
            <Typography color="text.primary" component="span">
              {collection?.name}
            </Typography>
            <Typography color="text.primary" component="span" sx={{ marginLeft: "10px" }}>
              #{index ? index + 1 : "--"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container mt="20px">
        <Grid item xs={12} className={classes.inputBox}>
          <Typography>
            <Trans>Transfer to</Trans>
          </Typography>
          <TextField
            variant="standard"
            placeholder={t`Account address`}
            onChange={({ target: { value } }) => setTo(value)}
            helperText={addressHelpText}
            fullWidth
            autoComplete="To"
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Grid>
        <Grid item xs={12} mt="10px">
          <Typography color="text.danger">
            <Trans>Please ensure that the receiving address supports this Token/NFT!</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} mt={3}>
          <Identity onSubmit={transferSubmitCallback}>
            {({ submit, loading }: CallbackProps) => (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                disabled={loading || !!errorMsg}
                onClick={submit}
                startIcon={loading ? <CircularProgress color="inherit" size={30} /> : null}
              >
                {errorMsg || (loading ? "" : t`Confirm`)}
              </Button>
            )}
          </Identity>
        </Grid>
      </Grid>
    </Modal>
  ) : null;
}
