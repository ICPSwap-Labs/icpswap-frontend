import { Box, Grid, Typography, ButtonBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { mockALinkAndOpen } from "utils";
import { useICPPrice } from "store/global/hooks";
import { APP_LINK } from "constants/index";
import { Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Logo from "ui-component/Logo";

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    marginLeft: "20px",
    display: "flex",
    [theme.breakpoints.down("md")]: {
      width: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  price: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    background: theme.palette.background.level2,
    borderRadius: "12px",
    padding: "0 16px",
  },
}));

export function APP() {
  const handleLoadToApp = () => {
    mockALinkAndOpen(APP_LINK, "link_app");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #4F5A84",
        borderRadius: "8px",
        height: "30px",
        width: "55px",
        cursor: "pointer",
      }}
      onClick={handleLoadToApp}
    >
      <Typography fontSize="12px">App</Typography>
    </Box>
  );
}

export default function Header() {
  const classes = useStyles();
  const ICPPrice = useICPPrice();

  return (
    <Grid
      container
      sx={{
        background: "#0B132F",
        height: "60px",
      }}
      alignItems="center"
    >
      <Box className={classes.logo}>
        <Box component="span" sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}>
          <ButtonBase disableRipple component={Link} to="/">
            <Logo />
          </ButtonBase>
        </Box>
        <Box className={classes.price} ml="10px">
          <Typography color="text.primary">ICP: ${ICPPrice ?? "0.00"}</Typography>
        </Box>
      </Box>
      <Grid item xs>
        <Grid
          container
          justifyContent="flex-end"
          sx={{
            paddingRight: {
              xs: "10px",
              md: "40px",
            },
          }}
        >
          <APP />
        </Grid>
      </Grid>
    </Grid>
  );
}
