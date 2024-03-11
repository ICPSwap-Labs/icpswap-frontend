import { Grid, Box, useTheme, Typography, createTheme, useMediaQuery, SvgIcon } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import MainCard from "components/cards/MainCard";
import { t, Trans } from "@lingui/macro";
import NFTIcon from "assets/images/console/NFT.svg";
import { mockALinkToOpen } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import ConnectWallet from "../../components/ConnectWallet";
import { useConnectorStateConnected } from "store/auth/hooks";

export type Route = {
  label: string;
  path?: string;
  link?: string;
};

export type Console = {
  label: string;
  title?: string;
  comingSoon?: boolean;
  routes?: Route[];
  path?: string;
  demo?: boolean;
  Icon?: any;
  link?: string;
};

const customizeTheme = createTheme({
  breakpoints: {
    values: {
      sm: 690,
      md: 1220,
      lg: 1520,
      xs: 375,
      xl: 1920,
    },
  },
});

const customizeBreakPoints = customizeTheme.breakpoints;

export function ArrowBackIos(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
    </SvgIcon>
  );
}

export function ConsoleItem({ label, Icon, comingSoon, path, link, title, demo, routes = [] }: Console) {
  const theme = useTheme() as Theme;
  const history = useHistory();
  const [onHover, setOnHover] = useState(false);

  const handleClick = () => {
    if (comingSoon) return;
    if (routes.length) {
      setOnHover(true);
      return;
    }

    if (link) {
      mockALinkToOpen(link, "console_link");
      return;
    }

    if (path) history.push(path);
  };

  const handleRouteClick = (route: Route) => {
    if (comingSoon) return;

    if (route.link) {
      mockALinkToOpen(route.link, "console_link");
      return;
    }
    if (!route.path) return;
    history.push(route.path);
  };

  const handleMouseEnter = () => {
    setOnHover(true);
  };

  const handleMouseLeave = () => {
    setOnHover(false);
  };

  return (
    <Grid
      container
      sx={{
        background: theme.palette.background.level1,
        boxShadow: "0px 4px 34px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        height: "140px",
        position: "relative",
        cursor: !comingSoon && (!!path || !!link) ? "pointer" : "default",
      }}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {comingSoon && (
        <Typography
          fontSize="10px"
          sx={{
            position: "absolute",
            top: "10px",
            right: "14px",
          }}
        >
          <Trans>Coming soon</Trans>
        </Typography>
      )}
      {demo && (
        <Typography
          fontSize="10px"
          sx={{
            position: "absolute",
            top: "10px",
            right: "14px",
          }}
        >
          <Trans>Demo</Trans>
        </Typography>
      )}
      {!!routes.length && onHover && (
        <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(17, 25, 54, 0.94)",
              boxShadow: "0px 4px 34px rgba(0, 0, 0, 0.25)",
              borderRadius: "12px",
            }}
          />
          <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", padding: "16px 0 0 40px" }}>
            <Box mb="12px">
              <Typography color="text.primary" fontWeight="700" fontSize="16px">
                {title}
              </Typography>
            </Box>
            {routes.map((route, index) => (
              <Grid
                container
                alignItems="center"
                key={route.path}
                mb={index === routes.length - 1 ? "0px" : "6px"}
                sx={{
                  "&:hover": {
                    "& .MuiSvgIcon-root": {
                      transform: "translateX(5px) rotate(180deg)",
                    },
                  },
                }}
              >
                <Typography
                  fontSize="14px"
                  sx={{ cursor: "pointer" }}
                  component="span"
                  onClick={() => handleRouteClick(route)}
                >
                  {route.label}
                </Typography>
                <ArrowBackIos
                  sx={{
                    transition: "transform 200ms",
                    transform: "rotate(180deg)",
                    fontSize: "12px",
                    color: theme.palette.text.secondary,
                  }}
                />
              </Grid>
            ))}
          </Box>
        </Box>
      )}
      <Grid item>
        <img src={Icon} alt="" />
      </Grid>
      <Grid item>
        <Typography
          color="text.primary"
          fontSize="20px"
          sx={{
            marginTop: "12px",
          }}
        >
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
}

const items: Console[] = [
  {
    label: t`NFT`,
    Icon: NFTIcon,
    path: "/nft/mint",
    title: t`NFT`,
    routes: [
      { label: t`Mint NFT`, path: "/console/nft/mint" },
      { label: t`NFT Canisters`, path: "/console/nft/canister/list" },
    ],
  },
];

export default function ConsolePage() {
  const matchDownMD = useMediaQuery(customizeBreakPoints.down("lg"));
  const matchDownSM = useMediaQuery(customizeBreakPoints.down("md"));
  const matchDownSM1 = useMediaQuery(customizeBreakPoints.down("sm"));

  const walletIsConnected = useConnectorStateConnected();

  return walletIsConnected ? (
    <MainCard>
      <Box>
        <Grid container spacing="29px">
          {items.map((item, index) => (
            <Grid key={item.path ?? index} item xs={matchDownMD ? (matchDownSM ? (matchDownSM1 ? 12 : 6) : 4) : 3}>
              <ConsoleItem comingSoon={!!item.comingSoon} {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainCard>
  ) : (
    <ConnectWallet />
  );
}
