import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useCallback } from "react";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { Flex, LoadingRow } from "components/index";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import NFTAvatar from "components/NFT/NFTAvatar";
import { useTranslation } from "react-i18next";
import { useNFTMetadata } from "hooks/nft/useNFTMetadata";
import { isUndefinedOrNull, shorten } from "@icpswap/utils";

export function NFTTokenDetails() {
  const { setPages } = useWalletContext();
  const { displayedNFTTokenInfo, setSendingNFTMetadata } = useWalletNFTContext();
  const { t } = useTranslation();
  const theme = useTheme();

  const { metadata, loading } = useNFTMetadata(displayedNFTTokenInfo?.id, displayedNFTTokenInfo?.index);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.NFTCanister);
  }, [setPages]);

  const handleNFTSend = useCallback(() => {
    if (isUndefinedOrNull(metadata)) return;
    setSendingNFTMetadata(metadata);
    setPages(WalletManagerPage.NFTSend);
  }, [setPages, metadata, setSendingNFTMetadata]);

  return displayedNFTTokenInfo ? (
    <DrawerWrapper
      padding="12px"
      title={t("common.details")}
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={handlePrev}
    >
      <Box
        sx={{
          margin: "40px 0 0 0",
        }}
      >
        {loading || !metadata ? (
          <Box sx={{ padding: "12px" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : (
          <>
            <Flex fullWidth justify="center">
              <Box sx={{ width: "300px", height: "300px" }}>
                <NFTAvatar metadata={metadata} />
              </Box>
            </Flex>

            <Button fullWidth variant="contained" size="large" sx={{ margin: "20px 0 0 0" }} onClick={handleNFTSend}>
              {t("common.send")}
            </Button>

            <Box sx={{ margin: "26px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
              <Flex fullWidth justify="space-between">
                <Typography>NFT name</Typography>

                <Typography
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {metadata.name}
                </Typography>
              </Flex>

              <Flex fullWidth justify="space-between">
                <Typography>ID</Typography>

                <Typography
                  sx={{
                    color: "text.primary",
                  }}
                >
                  #{metadata.tokenId}
                </Typography>
              </Flex>

              <Flex fullWidth justify="space-between">
                <Typography>Owned</Typography>

                <Typography
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {shorten(metadata.owner)}
                </Typography>
              </Flex>
            </Box>

            {metadata.introduction ? (
              <Box sx={{ margin: "20px 0 0 0" }}>
                <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level4 }} />

                <Box sx={{ margin: "20px 0 0 0 " }}>
                  <Typography>About</Typography>
                  <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px", lineHeight: "20px" }}>
                    {metadata.introduction}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </>
        )}
      </Box>
    </DrawerWrapper>
  ) : null;
}
