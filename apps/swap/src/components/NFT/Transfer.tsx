import { useCallback, useState, useMemo } from "react";
import LazyImage from "components/LazyImage";
import { Button, Grid, TextField, Typography, CircularProgress, Box } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { stringToArrayBuffer, encodeTokenIdentifier } from "utils";
import { isValidAccount } from "@icpswap/utils";
import Modal from "components/modal/index";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { useAccount } from "store/global/hooks";
import { useNFTTransferCallback, useCanisterMetadata } from "hooks/nft/useNFTCalls";
import { t, Trans } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { useNFTByMetadata } from "hooks/nft/useNFTMetadata";
import { Theme } from "@mui/material/styles";
import type { NFTTokenMetadata } from "@icpswap/types";
import { getLocaleMessage } from "locales/services";
import FileImage from "./FileImage";

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

export default function NFTTransfer({
  canisterId,
  open,
  onClose,
  nft,
  onTransferSuccess,
}: {
  canisterId: string;
  open: boolean;
  onClose: () => void;
  nft: NFTTokenMetadata;
  onTransferSuccess: (result: any) => void;
}) {
  const classes = useStyles();
  const account = useAccount();
  const theme = useTheme() as Theme;
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [memo, setMemo] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const metadata = useNFTByMetadata(nft);
  const { result: canisterMetadata } = useCanisterMetadata(canisterId);

  const nftTransfer = useNFTTransferCallback();

  const transferSubmitCallback = useCallback(
    async (identity, { loading, closeLoading }) => {
      if (loading) return;

      const result = await nftTransfer(canisterId, identity, {
        from: { address: account },
        to: { address: to },
        memo: [...(memo ? stringToArrayBuffer(memo) : stringToArrayBuffer("TRANSFER"))],
        token: encodeTokenIdentifier(canisterId, nft.tokenId),
        amount: BigInt(1),
        subaccount: [],
        nonce: [],
        notify: false,
      });

      closeLoading();

      if (result.status === "ok") {
        openSuccessTip(t`Transferred successfully`);
      } else {
        openErrorTip(getLocaleMessage(result.message));
      }

      if (onTransferSuccess) onTransferSuccess(result);
    },
    [nftTransfer, nft, memo, to],
  );

  const addressHelpText = useMemo(() => {
    if (account === to)
      return (
        <span className={classes.warningText}>
          <Trans>Be careful, you are transferring tokens to your own address!</Trans>
        </span>
      );
  }, [account, to]);

  const handleClose = useCallback(() => {
    setTo("");
    setMemo("");
    if (onClose) onClose();
  }, [onClose, setTo, setMemo]);

  const errorMsg = useMemo(() => {
    if (!to) return t`Enter account address`;
    if (!isValidAccount(to)) return t`Invalid address`;
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
            <LazyImage
              src={metadata?.filePath}
              showDefault={metadata?.fileType !== "image"}
              CustomImage={
                metadata?.fileType !== "image" && !!metadata?.filePath ? (
                  <FileImage fileType={metadata?.fileType ?? ""} />
                ) : null
              }
            />
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
              {metadata.name}
            </Typography>
            <Typography color="text.primary" component="span" sx={{ marginLeft: "10px" }}>
              #{Number(metadata.tokenId)}
            </Typography>
          </Box>
          <Box mt="28px">
            <Typography className={classes.description}>{canisterMetadata?.introduction}</Typography>
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
        <Grid item xs={12} className={classes.inputBox} mt={3}>
          <Typography>
            <Trans>Memo (optional)</Trans>
          </Typography>
          <TextField
            variant="standard"
            placeholder="Memo"
            onChange={({ target: { value } }) => setMemo(value)}
            fullWidth
            autoComplete="off"
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
