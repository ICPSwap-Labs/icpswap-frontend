import Modal from "components/modal/index";
import { Typography, Box, Grid, Button } from "@mui/material";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { CanisterCreateDetails } from "types/index";
import { Trans, t } from "@lingui/macro";
import { parseTokenAmount } from "@icpswap/utils";

export default ({
  open,
  onConfirm,
  onClose = () => {},
  details,
  mintInfo,
}: {
  open: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  details: CanisterCreateDetails;
  mintInfo: [bigint, bigint, string, string] | undefined | null;
}) => {
  return (
    <>
      <Modal open={open} title={t`Creation Details`} onClose={onClose}>
        <Box>
          <Typography color="text.tertiary" align="center">
            <Trans>Pay</Trans>
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
                <Typography>
                  <Trans>Collection Name</Trans>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container mt={3}>
              <Grid item xs>
                <Typography>
                  <Trans>Creator</Trans>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.minter}
                </Typography>
              </Grid>
            </Grid>

            <Grid container mt={3}>
              <Grid item xs>
                <Typography>
                  <Trans>Royalties</Trans>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary" align="right">
                  {details.royalties}%
                </Typography>
              </Grid>
            </Grid>

            <Grid container mt={3}>
              <Grid item xs>
                <Typography>
                  <Trans>Social Media Links</Trans>
                </Typography>
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
              <Typography>Collection Description</Typography>
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
                Cancel
              </Button>
            </Grid>
            <Grid item xs>
              <Button variant="contained" size="large" fullWidth onClick={onConfirm}>
                <Trans>Confirm</Trans>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
