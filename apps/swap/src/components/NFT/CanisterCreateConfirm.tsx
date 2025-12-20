import Modal from "components/modal/index";
import { Typography, Box, Grid, Button, CircularProgress } from "components/Mui";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { CanisterCreateDetails } from "types/index";
import { parseTokenAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

export default ({
  open,
  onConfirm,
  onClose,
  details,
  mintInfo,
  loading,
}: {
  open: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  details: CanisterCreateDetails;
  mintInfo: [bigint, bigint, string, string] | undefined | null;
  loading: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal open={open} title={t("nft.creation.details")} onClose={onClose}>
        <Box>
          <Typography color="text.tertiary" align="center">
            {t("common.pay")}
          </Typography>
          <Typography
            variant="h2"
            color="text.primary"
            align="center"
            sx={{
              marginTop: "12px",
            }}
          >
            {parseTokenAmount((mintInfo ?? [])[0], WRAPPED_ICP_TOKEN_INFO.decimals).toNumber()}{" "}
            {WRAPPED_ICP_TOKEN_INFO.symbol}
          </Typography>
        </Box>

        <Box>
          <Grid container mt={2}>
            <Grid container mt={3}>
              <Grid item xs>
                <Typography>{t("nft.collection.name")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container mt={3}>
              <Grid item xs>
                <Typography>{t("common.creator")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.minter}
                </Typography>
              </Grid>
            </Grid>

            <Grid container mt={3}>
              <Grid item xs>
                <Typography>{t("nft.create.royalties")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.royalties}%
                </Typography>
              </Grid>
            </Grid>

            <Grid container mt={3}>
              <Grid item xs>
                <Typography>{t("common.social.media.links")}</Typography>
              </Grid>
              {(details.socialMediaLinks ?? []).length > 0 ? (
                <Grid item xs>
                  {details.socialMediaLinks.map((socialMediaLink) => {
                    if (socialMediaLink.value && socialMediaLink.label) {
                      return (
                        <Typography color="textPrimary" align="right" key={socialMediaLink.label}>
                          {socialMediaLink.value}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Grid>
              ) : (
                <Grid item xs>
                  <Typography color="textPrimary" align="right">
                    --
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Grid mt={3}>
              {t("nft.collection.description")}
              <Typography
                color="text.tertiary"
                sx={{
                  marginTop: "8px",
                }}
              >
                {details.introduction}
              </Typography>
            </Grid>
          </Grid>

          <Grid mt={4} container spacing={3}>
            <Grid item xs>
              <Button size="large" variant="outlined" fullWidth onClick={onClose}>
                {t("common.cancel")}
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={onConfirm}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
              >
                {t("common.confirm")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
