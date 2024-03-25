import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { Chip, ButtonBase, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  profileLabel: {
    lineHeight: 0,
    padding: "12px",
  },
  box: {
    marginLeft: "16px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "8px",
    },
  },
  profileRoot: {
    background: "transparent",
    color: "#fff",
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: "12px",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.themeOption.defaultGradient
          : `${theme.colors.lightPrimaryMain}!important`,
    },
  },
}));

export default function TokenClaim() {
  const classes = useStyles();
  const history = useHistory();

  const handleTokenClaim = () => {
    history.push("/token-claim");
  };

  return (
    <>
      <Box component="span" className={classes.box}>
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Chip
            classes={{ root: classes.profileRoot, label: classes.profileLabel }}
            label={t`Claim`}
            variant="outlined"
            onClick={handleTokenClaim}
            color="primary"
          />
        </ButtonBase>
      </Box>
    </>
  );
}
