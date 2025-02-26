import { useCallback, useState, useMemo } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
  useTheme,
  makeStyles,
  Theme,
} from "components/Mui";
import { formatTokenAmount, BigNumber } from "@icpswap/utils";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { sell, approve } from "hooks/nft/trade";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Modal, NumberTextField } from "components/index";
import { WRAPPED_ICP_TOKEN_INFO, ResultStatus } from "constants/index";
import type { NFTTokenMetadata, ActorIdentity } from "@icpswap/types";
import { NFTTradeFee } from "constants/nft";
import WICPCurrencyImage from "assets/images/wicp_currency.svg";
import LazyImage from "components/LazyImage";
import { encodeTokenIdentifier } from "utils/nft/index";
import { getLocaleMessage } from "i18n/service";
import { useAccount } from "store/auth/hooks";
import { useTranslation } from "react-i18next";

import FileImage from "../FileImage";

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
      "& input": {
        color: theme.themeOption.textPrimary,
      },
      "& input::placeholder": {
        color: theme.palette.primary[`400`],
      },
    },
    desc: {
      color: theme.palette.primary[`400`],
      lineHeight: "20px",
      fontSize: "12px",
      wordBreak: "break-all",
      ...theme.mixins.overflowEllipsis2,
    },
  };
});

export default function NFTSell({
  canisterId,
  open,
  onClose,
  nft,
  onSellSuccess,
}: {
  canisterId: string;
  open: boolean;
  onClose: () => void;
  nft: NFTTokenMetadata;
  onSellSuccess?: (result: any) => void;
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [price, setPrice] = useState<null | number | string>(null);

  const account = useAccount();

  const handleSell = useCallback(
    async (identity: ActorIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
      if (loading || !account || new BigNumber(price ?? 0).isEqualTo(0)) return;

      const tokenIdentifier = encodeTokenIdentifier(canisterId, Number(nft.tokenId));

      await approve({
        identity,
        canisterId,
        tokenIdentifier,
        account,
      });

      const result = await sell(identity, {
        nftCid: canisterId,
        price: BigInt(price ? formatTokenAmount(price, WRAPPED_ICP_TOKEN_INFO.decimals).toNumber() : 0),
        tokenIndex: Number(nft.tokenId),
      });

      closeLoading();

      if (result.status === ResultStatus.OK) {
        openSuccessTip(`Listed Successfully`);
      } else {
        openErrorTip(getLocaleMessage(result.message));
      }

      if (onSellSuccess) onSellSuccess(result);
    },
    [nft, account, price],
  );

  const handleClose = useCallback(() => {
    setPrice(null);
    if (onClose) onClose();
  }, [onClose, setPrice]);

  const errorMsg = useMemo(() => {
    if (!price) return `Enter the price`;
    if (price && new BigNumber(price).isLessThan(0.001))
      return t("common.must.greater.than", { symbol: "Price", amount: "0.001" });
  }, [price]);

  const receiveTokenAmount = useMemo(() => {
    if (!price) return 0;

    const TradeFee = new BigNumber(price).div(100);
    const CreatorFee = new BigNumber(price).multipliedBy(String(nft.royalties ?? 0)).div(100 * 100);

    return new BigNumber(price).minus(TradeFee).minus(CreatorFee).toFormat(8);
  }, [price]);

  return open ? (
    <Modal open={open} onClose={handleClose} title="List item for sale" background={theme.palette.background.level2}>
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
              src={nft?.filePath}
              showDefault={nft?.fileType !== "image"}
              CustomImage={
                nft?.fileType !== "image" && !!nft?.fileType ? <FileImage fileType={nft?.fileType ?? ""} /> : null
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
            "@media (max-width: 640px)": {
              height: "auto",
            },
          }}
          flexDirection="column"
        >
          <Box>
            <Typography color="text.primary" component="span">
              {nft.name}
            </Typography>
            <Typography color="text.primary" component="span" sx={{ marginLeft: "10px" }}>
              #{Number(nft.tokenId)}
            </Typography>
          </Box>
          <Box mt="28px">
            <Typography fontSize="12px">Listing is free. Once sold, the following fees will be deducted:</Typography>
            <Box>
              <Typography fontSize="12px" component="span">
                {t("nft.transactions.fees", { fee: new BigNumber(NFTTradeFee).multipliedBy(100).toNumber() })}
              </Typography>
              &nbsp;
              <Typography fontSize="12px" component="span">
                {t("nft.creator.royalty.percent", {
                  royalty: new BigNumber(String(nft.royalties ?? 0)).dividedBy(100).toNumber(),
                })}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container mt="20px">
        <Grid item xs={12} className={classes.inputBox}>
          <Typography>{t("nft.sell.price")}</Typography>
          <NumberTextField
            fullWidth
            variant="standard"
            value={price}
            placeholder="Enter the price"
            onChange={({ target: { value } }) => setPrice(value)}
            numericProps={{
              thousandSeparator: true,
              decimalScale: WRAPPED_ICP_TOKEN_INFO.decimals,
              allowNegative: false,
              maxLength: 20,
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <img width="18px" src={WICPCurrencyImage} alt="" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid container alignItems="center" mt="4px">
          <Typography
            color="text.primary"
            component="span"
            sx={{
              marginRight: "5px",
              paddingLeft: "3px",
              fontSize: "12px",
            }}
          >
            You will receive: {receiveTokenAmount}
          </Typography>
          <img width="16px" src={WICPCurrencyImage} alt="" />
        </Grid>
        <Grid item xs={12} mt={3}>
          <Identity onSubmit={handleSell}>
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
                {errorMsg || (loading ? "" : `Confirm`)}
              </Button>
            )}
          </Identity>
        </Grid>
      </Grid>
    </Modal>
  ) : null;
}
