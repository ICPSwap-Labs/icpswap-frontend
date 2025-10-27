import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useCallback } from "react";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { Flex, LoadingRow } from "components/index";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { NFTAvatar as ExtNFTAvatar } from "components/NFT/ext/NFTAvatar";
import NFTAvatar from "components/NFT/NFTAvatar";
import { useTranslation } from "react-i18next";
import { nonUndefinedOrNull, shorten } from "@icpswap/utils";
import { useClosePageBackToNFT } from "hooks/wallet/useClosePageBackToNFT";
import { NFTTokenMetadata } from "@icpswap/types";

interface NFTTokenDetailsUIProps {
  logo: string | undefined;
  name: string | undefined;
  index: number | undefined;
  loading: boolean;
  description: string | undefined;
  owner: string | undefined;
  onSend: () => void;
  isExt?: boolean;
  metadata?: NFTTokenMetadata;
}

export function NFTTokenDetailsUI({
  logo,
  name,
  loading,
  index,
  owner,
  description,
  onSend,
  isExt,
  metadata,
}: NFTTokenDetailsUIProps) {
  const { setPages } = useWalletContext();
  const { t } = useTranslation();
  const theme = useTheme();

  const handlePrev = useCallback(() => {
    setPages(isExt ? WalletManagerPage.NFTExtCanister : WalletManagerPage.NFTCanister);
  }, [setPages, isExt]);

  const closePage = useClosePageBackToNFT();

  return (
    <DrawerWrapper
      padding="12px"
      title={t("common.details")}
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={closePage}
    >
      <Box
        sx={{
          margin: "40px 0 0 0",
        }}
      >
        {loading ? (
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
                {isExt ? <ExtNFTAvatar image={logo} /> : <NFTAvatar metadata={metadata} />}
              </Box>
            </Flex>

            <Button fullWidth variant="contained" size="large" sx={{ margin: "20px 0 0 0" }} onClick={onSend}>
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
                  {name}
                </Typography>
              </Flex>

              <Flex fullWidth justify="space-between">
                <Typography>ID</Typography>

                <Typography
                  sx={{
                    color: "text.primary",
                  }}
                >
                  #{index}
                </Typography>
              </Flex>

              <Flex fullWidth justify="space-between">
                <Typography>Owned</Typography>

                <Typography
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {shorten(owner)}
                </Typography>
              </Flex>
            </Box>

            {nonUndefinedOrNull(description) ? (
              <Box sx={{ margin: "20px 0 0 0" }}>
                <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level4 }} />

                <Box sx={{ margin: "20px 0 0 0 " }}>
                  <Typography>About</Typography>
                  <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px", lineHeight: "20px" }}>
                    {description}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </>
        )}
      </Box>
    </DrawerWrapper>
  );
}
