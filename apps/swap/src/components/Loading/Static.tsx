import { Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingImage from "assets/images/loading.png";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    loadingContainer: {
      position: "relative",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      minHeight: "300px",
      overflow: "hidden",
    },
    mask: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: theme.palette.loading.background,
      opacity: 0.3,
    },
  };
});

export interface StaticLoadingProps {
  loading: boolean;
  mask?: boolean;
}

export default ({ loading, mask = false }: StaticLoadingProps) => {
  const classes = useStyles();

  return loading ? (
    <Grid className={classes.loadingContainer} container justifyContent="center" alignContent="center">
      <Box className={mask ? classes.mask : ""} />
      <img style={{ zIndex: 2 }} width="80px" height="80px" src={LoadingImage} alt="" />
    </Grid>
  ) : null;
};
