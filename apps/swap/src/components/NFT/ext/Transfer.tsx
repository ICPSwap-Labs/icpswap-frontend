import { Principal } from "@icp-sdk/core/principal";
import { ext_nft } from "@icpswap/actor";
import { useLoadingCallData } from "@icpswap/hooks";
import type { EXTCollection, ExtNft } from "@icpswap/types";
import { isValidAccount, isValidPrincipal, resultFormat } from "@icpswap/utils";
import LazyImage from "components/LazyImage";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  type Theme,
  Typography,
  useTheme,
} from "components/Mui";
import Modal from "components/modal/index";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useAccountPrincipal } from "store/auth/hooks";

const useStyles = makeStyles((theme: Theme) => {
  return {
    warningText: {
      color: theme.palette.warning.dark,
    },
    inputBox: {
      border: `1px solid ${theme.colors.color0}`,
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
  const { t } = useTranslation();
  const classes = useStyles();
  const account = useAccount();
  const theme = useTheme();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [to, setTo] = useState<string>("");
  const principal = useAccountPrincipal();

  const { loading, callback: handleTransfer } = useLoadingCallData(
    useCallback(async () => {
      if (!principal || !to) return;

      const result = resultFormat<bigint>(
        await (await ext_nft(nft.canister, true)).transfer({
          to: to && isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
          token: nft.id,
          notify: false,
          from: { principal },
          memo: [],
          subaccount: [],
          amount: BigInt(1),
        }),
      );

      if (result.status === "ok") {
        openSuccessTip(t`Transferred successfully`);
        if (onTransferSuccess) onTransferSuccess(result);
      } else {
        openErrorTip(getLocaleMessage(result.message));
      }
    }, [nft, to, onTransferSuccess, openErrorTip, openSuccessTip, principal, t]),
  );

  const addressHelpText = useMemo(() => {
    if (account === to) return <span className={classes.warningText}>{t("common.warning.transfer")}</span>;

    return undefined;
  }, [account, to, classes.warningText, t]);

  const handleClose = useCallback(() => {
    setTo("");
    if (onClose) onClose();
  }, [onClose]);

  const errorMsg = useMemo(() => {
    if (!to) return t("common.enter.account.address");
    if (!isValidAccount(to) && !isValidPrincipal(to)) return t("invalid.address");
  }, [to, t]);

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
          <Typography>{t("common.transfer.to")}</Typography>
          <TextField
            variant="standard"
            placeholder={t("common.account.address")}
            onChange={({ target: { value } }) => setTo(value)}
            helperText={addressHelpText}
            fullWidth
            autoComplete="To"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} mt="10px">
          <Typography color="text.danger">{t("common.warning.transfer.address.supports")}</Typography>
        </Grid>
        <Grid item xs={12} mt={3}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            size="large"
            disabled={loading || !!errorMsg}
            onClick={handleTransfer}
            startIcon={loading ? <CircularProgress color="inherit" size={30} /> : null}
          >
            {errorMsg || (loading ? "" : t`Confirm`)}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  ) : null;
}
