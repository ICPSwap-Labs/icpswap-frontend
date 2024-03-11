import { useState, useContext, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Button, Grid, Typography } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import MainCard from "../cards/MainCard";
import UserAvatar from "components/UserWalletAvatar";
import { formatDollarAmount } from "@icpswap/utils";
import AddressClipboard from "../AddressClipboard";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Bg0Dark from "assets/images/wallet/background0-dark.svg";
import Bg0Light from "assets/images/wallet/background0-light.svg";
import { useAccount } from "store/global/hooks";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import WalletContext from "./context";
import { useSuccessTip } from "hooks/useTips";
import { useICPPrice } from "hooks/useUSDPrice";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    [theme.breakpoints.down("sm")]: {
      transform: "scale(0.7)",
    },
  },
  leftEmptyBox: {
    width: "80px",
    height: "80px",
  },
  userTopContent: {
    padding: "12px",
    position: "relative",
    paddingBottom: "12px !important",
    ...(theme.customization.mode === "light" ? { backgroundColor: theme.colors.lightPrimaryMain } : {}),
  },
  userAvatar: {
    margin: "-70px 0 0 auto",
    borderRadius: "16px",
    [theme.breakpoints.down("md")]: {
      margin: "-70px auto 0",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "-60px auto 0",
    },
  },

  copyButton: {
    width: "0.6em",
    cursor: "pointer",
    ...(theme.customization.mode === "light" ? { color: "#ffffff" } : {}),
  },
  mainCardBg: {
    background: "transparent",
    position: "absolute",
    top: "-86px",
    right: "146px",
    width: "283px",
    height: "283px",
    backgroundImage: `url(${theme.customization.mode === "dark" ? Bg0Dark : Bg0Light})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  },
  lightFontColor: {
    ...(theme.customization.mode === "light" ? { color: "#ffffff" } : {}),
  },
  refresh: {
    ...(theme.customization.mode === "light" ? { color: "#ffffff", border: "1px solid #ffffff" } : {}),
    "&:hover": {
      ...(theme.customization.mode === "light" ? { color: "#ffffff", border: "1px solid #ffffff" } : {}),
    },
  },
}));

export default function WalletAccount() {
  const [addressClipboardVisible, setAddressClipboardVisible] = useState(false);
  const classes = useStyles();
  const account = useAccount();
  const icpPrice = useICPPrice();

  const [openSuccessTip] = useSuccessTip();

  const { refreshTotalBalance, setRefreshTotalBalance, refreshCounter, setRefreshCounter, totalValue } =
    useContext(WalletContext);

  const useTotalICPValue = useMemo(() => {
    if (icpPrice) return totalValue.dividedBy(icpPrice);
    return undefined;
  }, [totalValue, icpPrice]);

  const onAddressClipboardClose = () => {
    setAddressClipboardVisible(false);
  };

  const handleRefreshBalance = () => {
    if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
    setRefreshCounter(refreshCounter + 1);
    openSuccessTip("Refresh Success");
  };

  return (
    <>
      <MainCard contentClass={classes.userTopContent} level={4}>
        <Grid container>
          <Grid item container xs={12} lg={8} sm={12} direction="column" spacing={1}>
            <Grid item container>
              <Box
                sx={{
                  display: "grid",
                  gridGap: "0 14px",
                  gridTemplateColumns: "auto 1fr",
                  zIndex: 10,
                }}
              >
                <Box className={classes.avatar}>
                  <Grid container justifyContent="center" alignItems="center">
                    <UserAvatar size="70" value={account} />
                  </Grid>
                </Box>
                <Box
                  sx={{
                    alignSelf: "center",
                  }}
                >
                  <Grid container item xs alignItems="flex-start" direction="column" justifyContent="center">
                    <Grid item xs={4}>
                      <Typography className={classes.lightFontColor} variant="h2" color="primary">
                        <Trans>Account Address</Trans>
                      </Typography>
                    </Grid>
                    <Grid container alignItems="center" flexWrap="nowrap">
                      <Grid container alignItems="center" flexWrap="nowrap">
                        <Typography
                          className={classes.lightFontColor}
                          variant="subtitle2"
                          sx={{
                            wordBreak: "break-all",
                          }}
                        >
                          {account}
                        </Typography>
                        &nbsp;
                        <DashboardOutlinedIcon
                          className={classes.copyButton}
                          onClick={() => setAddressClipboardVisible(true)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item container>
              <Grid
                item
                sx={{ display: { xs: "none", sm: "block" } }}
                className={`${classes.leftEmptyBox} ${classes.avatar}`}
              >
                &nbsp;
              </Grid>
              <Grid
                container
                item
                xs={9}
                flexDirection="column"
                sx={{
                  alignItems: { xs: "flex-start" },
                  justifyContent: { sm: "flex-start", xs: "center" },
                  zIndex: 10,
                }}
              >
                <Grid item>
                  <Typography className={classes.lightFontColor} color="textSecondary">
                    <Trans>Estimated Balance</Trans>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.lightFontColor} color="textPrimary" variant="h1">
                    ≈{useTotalICPValue ? useTotalICPValue.toFormat(4) : 0}&nbsp;ICP
                    <Box display={{ xs: "block", md: "inline" }} ml={{ xs: 0, md: 2 }} mt={{ xs: -2, md: 0 }}>
                      <Typography
                        className={classes.lightFontColor}
                        color="textSecondary"
                        variant="h4"
                        display="inline"
                      >
                        ≈{formatDollarAmount(totalValue.toString(), 2)}
                      </Typography>
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            item
            lg={4}
            xs={12}
            sm={12}
            md={12}
            direction="column"
            spacing={1}
            sx={{
              zIndex: 1,
            }}
          >
            <Grid container item xs={4} justifyContent="flex-end">
              <Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.refresh}
                  startIcon={<ReplayIcon />}
                  onClick={handleRefreshBalance}
                >
                  <Trans>Refresh Balance</Trans>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: {
              sm: "none",
              md: "block",
            },
          }}
          className={classes.mainCardBg}
        />
      </MainCard>
      <AddressClipboard address={account} open={addressClipboardVisible} onClose={onAddressClipboardClose} />
    </>
  );
}
