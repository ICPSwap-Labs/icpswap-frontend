import Modal from "components/modal/index";
import { useHistory } from "react-router-dom";
import { Typography, Box, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ExplorerLink from "components/ExternalLink/Explorer";
import { Theme } from "@mui/material/styles";
import { CanisterCreateDetails } from "types/nft";

const useStyles = makeStyles((theme: Theme) => ({
  checkCircle: {
    fontSize: "6em",
    color: theme.themeOption.colors.successDark,
  },
}));

export default ({
  open,
  onClose,
  details,
  canisterId,
}: {
  open: boolean;
  onClose: () => void;
  details: CanisterCreateDetails;
  canisterId: string;
}) => {
  const classes = useStyles();
  const history = useHistory();

  const handleMintNFT = () => {
    onClose();
    history.push("/info-tools/nft/canister/list");
  };

  const handleToList = () => {
    onClose();
    history.push("/info-tools/nft/canister/list");
  };

  return (
    <Modal open={open} title="Create details" onClose={onClose}>
      <Grid container alignItems="center" flexDirection="column">
        <CheckCircleIcon className={classes.checkCircle} />
        <Typography
          variant="h3"
          color="text.primary"
          align="center"
          sx={{
            marginTop: "8px",
          }}
        >
          Created successfully
        </Typography>
      </Grid>

      <Box mt={3}>
        <Grid container>
          <Grid container>
            <Grid item xs>
              <Typography> {t("common.canister.name")}</Typography>
            </Grid>
            <Grid item xs>
              <Typography color="textPrimary" align="right">
                {details.name}
              </Typography>
            </Grid>
          </Grid>

          {/* <Grid container mt={3}>
            <Grid item xs>
              <Typography>Canister Size</Typography>
            </Grid>
            <Grid item xs>
              <Typography color="textPrimary" align="right">
                {details.name}
              </Typography>
            </Grid>
          </Grid> */}

          <Grid container mt={3}>
            <Grid item xs>
              <Typography>Canister ID</Typography>
            </Grid>
            <Grid item xs>
              <Typography color="textPrimary" align="right">
                <ExplorerLink value={canisterId} label={canisterId} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid mt={4} container spacing={3}>
          <Grid item xs>
            <Button size="large" variant="outlined" fullWidth onClick={handleToList}>
              To canister list
            </Button>
          </Grid>
          <Grid item xs>
            <Button variant="contained" size="large" fullWidth onClick={handleMintNFT}>
              {t("nft.mint")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
