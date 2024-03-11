import { Grid, Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import ComingSoonIcon from "assets/images/icons/coming-soon.svg";
import ComingSoonLightIcon from "assets/images/icons/coming-soon-light.svg";
import { Theme } from "@mui/material/styles";
import { isDarkTheme } from "utils";

const useStyles = makeStyles(() => {
  return {
    container: {
      height: "320px",
    },
  };
});

export default () => {
  const classes = useStyles();
  const theme = useTheme() as Theme;

  const Icon = isDarkTheme(theme) ? ComingSoonIcon : ComingSoonLightIcon;

  return (
    <Grid container justifyContent="center" alignItems="center" className={classes.container}>
      <Grid item container justifyContent="center" flexDirection="column" alignItems="center">
        <img src={Icon} alt="" />
        <Typography sx={{ p: 2 }} variant="h2">
          Coming Soon...
        </Typography>
      </Grid>
    </Grid>
  );
};
