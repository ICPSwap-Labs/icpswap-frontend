import { Grid, Typography, CircularProgress, useTheme, Box } from "@mui/material";
import Modal from "components/modal/index";
import { t, Trans } from "@lingui/macro";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Theme } from "@mui/material/styles";
import { TradeOrder } from "types/nft";
import { type NFTTokenMetadata, type ActorIdentity, ResultStatus } from "@icpswap/types";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { useNFTBuyCallback } from "hooks/nft/trade";
import { useApprove } from "hooks/token/useApprove";
import {
  getCanisterId,
  CANISTER_NAMES,
  NFTTradeTokenCanisterId,
  WRAPPED_ICP_TOKEN_INFO,
  NFTTradeFee,
} from "constants/index";
import { parseTokenAmount, numberToString } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useICPAmountUSDValue, useAccount } from "store/global/hooks";
import { formatDollarAmount } from "utils/numbers";
import WICPPriceFormat from "components/NFT/WICPPriceFormat";
import LazyImage from "components/LazyImage";
import FileImage from "../FileImage";
import { getLocaleMessage } from "locales/services";
import { useNFTByMetadata } from "hooks/nft/useNFTMetadata";
import { useNFTMetadata as useNFTMetadataCall } from "hooks/nft/useNFTCalls";
import VerifyNFT from "components/NFT/VerifyNFT";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { TextButton } from "components/index";
import Button from "components/authentication/ButtonConnector";

export default function NFTBuyReview({
  order,
  open,
  onClose,
  onTradeSuccess,
}: {
  order: TradeOrder | undefined | null;
  open: boolean;
  onClose: () => void;
  onTradeSuccess?: () => void;
}) {
  const theme = useTheme() as Theme;

  const account = useAccount();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const approve = useApprove();
  const buy = useNFTBuyCallback();

  const { result } = useNFTMetadataCall(order?.nftCid, order?.tokenIndex);
  const _metadata = result ?? ({} as NFTTokenMetadata);

  const nft = useNFTByMetadata(_metadata);

  const handleBuyNFT = async (identity: ActorIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading) return;

    const TradeCanisterId = getCanisterId(CANISTER_NAMES.NFTTrade);

    const { status: approveStatus, message: approveMessage } = await approve({
      canisterId: NFTTradeTokenCanisterId,
      spender: TradeCanisterId,
      account,
      value: numberToString(parseTokenAmount(userPay, WRAPPED_ICP_TOKEN_INFO.decimals)),
    });

    if (approveStatus === "err") {
      openErrorTip(approveMessage);
      closeLoading();
      return;
    }

    const { status, message } = await buy(identity, order?.nftCid ?? "", order?.tokenIndex ?? 0);

    if (status === ResultStatus.ERROR) {
      openErrorTip(getLocaleMessage(message) ?? "Transaction failed");
    } else {
      openSuccessTip(t`Traded successfully`);
      if (onTradeSuccess) onTradeSuccess();
    }

    closeLoading();
  };

  const USDValue = useICPAmountUSDValue(order?.price);

  // 3 times transaction fee
  const userTransFee = parseTokenAmount(WRAPPED_ICP_TOKEN_INFO.transFee, WRAPPED_ICP_TOKEN_INFO.decimals).multipliedBy(
    3,
  );

  const userPay = new BigNumber(order?.price ? String(order.price) : 0)
    .plus(new BigNumber(String(WRAPPED_ICP_TOKEN_INFO.transFee)).multipliedBy(3))
    .toNumber();

  const { result: tradeTokenBalance } = useTokenBalance(NFTTradeTokenCanisterId, account);

  return (
    <Modal open={open} onClose={onClose} title={t`Confirm Buying`} background={theme.palette.background.level2}>
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #29314F",
          background: theme.palette.background.level4,
          padding: "12px",
        }}
      >
        <Grid
          container
          sx={{
            "@media (max-width: 640px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              minWidth: "140px",
              "@media (max-width: 640px)": {
                width: "140px",
              },
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
                padding: "5px",
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
          </Box>

          <Grid
            item
            xs
            sx={{
              height: "120px",
              marginLeft: "20px",
              overflow: "hidden",
              "@media (max-width: 640px)": {
                marginLeft: "10px",
                height: "auto",
                overflow: "initial",
              },
            }}
          >
            <Box sx={{ overflow: "hidden" }}>
              <Box mt="10px" sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                <Typography color="text.primary" component="span">
                  {order?.name}
                </Typography>
                <Typography color="text.primary" component="span" sx={{ marginLeft: "10px" }}>
                  #{String(order?.tokenIndex)}
                </Typography>
              </Box>
              <Box mt="10px">
                <VerifyNFT minter={order?.minter} secondaryColor />
              </Box>
              <Grid
                container
                alignItems="center"
                sx={{
                  marginTop: "40px",
                  "@media (max-width: 640px)": {
                    marginTop: "10px",
                  },
                }}
              >
                <Box>
                  <WICPPriceFormat imgSize="20px" price={order?.price} color="text.primary" />
                </Box>
                {USDValue ? (
                  <Typography ml="8px" mt="3px">
                    ({formatDollarAmount(USDValue?.toNumber())})
                  </Typography>
                ) : null}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt="30px">
        <Grid container>
          <Grid item xs>
            <Typography>
              <Trans>Transaction Fee</Trans>
            </Typography>
          </Grid>
          <Typography color="text.primary">{new BigNumber(NFTTradeFee).multipliedBy(100).toFixed(2)}%</Typography>
        </Grid>
        <Grid container mt="20px">
          <Grid item xs>
            <Typography>
              <Trans>Creator Royalty</Trans>
            </Typography>
          </Grid>
          <Typography color="text.primary">
            {new BigNumber(String(order?.royalties)).dividedBy(100).toFixed(2)}%
          </Typography>
        </Grid>
        <Grid container mt="20px">
          <Grid item xs>
            <Typography>
              <Trans>Transfer Fee</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <WICPPriceFormat price={userTransFee.toFormat()} fontSize="14px" />
          </Grid>
        </Grid>
        <Grid container mt="20px">
          <Grid item xs>
            <Typography>
              <Trans>Pay (All fees included)</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <WICPPriceFormat imgSize="18px" price={userPay} />
          </Grid>
        </Grid>
      </Box>
      <Box mt={3}>
        <Identity onSubmit={handleBuyNFT} fullScreenLoading>
          {({ submit, loading }: CallbackProps) => (
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
            >
              <Trans>Confirm</Trans>
            </Button>
          )}
        </Identity>
      </Box>
      <Grid container sx={{ position: "relative" }} mt="12px" justifyContent="flex-start">
        <Typography color="text.primary" sx={{ "@media (max-width: 640px)": { fontSize: "12px" } }}>
          <Trans>Balance:</Trans>{" "}
          {tradeTokenBalance
            ? parseTokenAmount(tradeTokenBalance.toString(), WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()
            : 0}{" "}
          WICP
        </Typography>
        <Box sx={{ position: "absolute", right: "0", top: "0" }}>
          <TextButton to="/swap/v2/wrap" sx={{ fontWeight: "500", "@media (max-width: 640px)": { fontSize: "12px" } }}>
            Get WICP
          </TextButton>
        </Box>
      </Grid>
    </Modal>
  );
}
