import { makeStyles, Theme, LinearProgress, Typography } from "../Mui";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1301,
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  image: {
    padding: "120px 0 0 0",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export function LinearLoader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.loader}>
        <LinearProgress color="primary" />
      </div>
      <div className={classes.image}>
        <img src="/images/loading-page.gif" alt="loading" width="200px" height="200px" />
        <Typography sx={{ color: "text.primary", fontSize: "16px" }}>Loading… Please wait.</Typography>
      </div>
    </div>
  );
}
