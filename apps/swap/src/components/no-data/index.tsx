import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import NoDataIcon from "assets/images/icons/no-data";

const useStyles = makeStyles(() => {
  return {
    noDataContainer: {
      height: "140px",
    },
  };
});

export default function NoData() {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" alignItems="center" className={classes.noDataContainer}>
      <Grid item>
        <NoDataIcon style={{ fontSize: "6rem" }} />
      </Grid>
    </Grid>
  );
}
