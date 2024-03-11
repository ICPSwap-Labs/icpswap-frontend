import { Grid, Box, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoadingImage from "assets/images/loading.png";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles(() => {
  return {
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      minHeight: "140px",
      paddingTop: "56px",
      overflow: "hidden",
    },
    mask: {
      position: "absolute",
      top: "56px",
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0.2,
    },
  };
});

export interface ListLoadingProps {
  loading: boolean;
  mask?: boolean;
  maskBackground?: string;
}

export default function ListLoading({ loading, mask = true, maskBackground }: ListLoadingProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;

  return loading ? (
    <Grid className={classes.loadingContainer} container justifyContent="center" alignContent="center">
      <Box
        className={mask ? classes.mask : ""}
        sx={{ background: maskBackground ? maskBackground : theme.palette.loading.background }}
      />
      <img style={{ zIndex: 2 }} width="80px" height="80px" src={LoadingImage} alt="" />
    </Grid>
  ) : null;
}
