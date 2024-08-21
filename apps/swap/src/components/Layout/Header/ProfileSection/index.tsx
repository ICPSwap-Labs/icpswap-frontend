import { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { Chip, List, Paper, Popper, ButtonBase, Box, Typography, useMediaQuery, SvgIcon, Fade } from "@mui/material";
import { shorten } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import {
  useAccountPrincipal,
  useConnectorStateConnected,
  useUserLogout,
  useWalletConnectorManager,
  useConnectorType,
} from "store/auth/hooks";
import { Theme } from "@mui/material/styles";
import { Flex } from "@icpswap/ui";
import { Connector } from "constants/wallet";

import { AccountSection } from "./Account";
import Principal from "./Principal";
import LogoutIcon from "./LogoutIcon";
import LogOutSection from "../LogOutSection";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: "#fff",
    borderRadius: "12px",
  },
  navContainer: {
    width: "100%",
    maxWidth: "350px",
    minWidth: "300px",
    borderRadius: "10px",
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
      maxWidth: "280px",
    },
  },
  profileChip: {
    height: "48px",
    alignItems: "center",
    borderRadius: "27px",
    transition: "all .2s ease-in-out",
    borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
    '&[aria-controls="menu-list-grow"], &:hover': {
      borderColor: theme.palette.primary.main,
      background: `${theme.palette.primary.main}!important`,
      color: theme.palette.primary.light,
      "& svg": {
        stroke: theme.palette.primary.light,
      },
    },
  },
  profileLabel: {
    lineHeight: 0,
    padding: "12px",
  },
  listItem: {
    paddingLeft: "30px",
    wordBreak: "break-all",
    display: "flex",
    height: "52px",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#F5F5FF",
    },
    "& .MuiTypography-root": {
      color: "#111936",
      marginLeft: "10px",
    },
  },
  profileRoot: {
    background: theme.palette.mode === "dark" ? theme.themeOption.defaultGradient : theme.colors.lightPrimaryMain,
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.themeOption.defaultGradient
          : `${theme.colors.lightPrimaryMain}!important`,
    },
  },
}));

export function ICRocksLoadIcon(props: any) {
  return (
    <SvgIcon viewBox="0 0 15 14" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H6V2H2V12H12V8H14V14H0V0Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7865 2H8.40071V0H13.0033H14.0033V1V5.60261H12.0033V3.6116L5.81851 9.79641L4.4043 8.3822L10.7865 2Z"
      />
    </SvgIcon>
  );
}

export default function ProfileSection() {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const prevOpen = useRef(open);

  const principal = useAccountPrincipal();
  const isConnected = useConnectorStateConnected();
  const logout = useUserLogout();
  const connectorType = useConnectorType();

  const [, walletManager] = useWalletConnectorManager();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) return;
    setOpen(false);
  };

  const handleConnectWallet = async () => {
    await logout();
    walletManager(true);
  };

  useEffect(() => {
    if (anchorRef.current && prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <ButtonBase sx={{ borderRadius: "12px" }}>
        <Chip
          ref={anchorRef}
          classes={{ root: classes.profileRoot, label: classes.profileLabel }}
          label={isConnected && !!principal ? shorten(principal.toString()) : t`Connect Wallet`}
          variant="outlined"
          onClick={isConnected ? handleToggle : handleConnectWallet}
          color="primary"
        />
      </ButtonBase>

      {/* @ts-ignore */}
      <Popper
        placement={matchDownMD ? "bottom-start" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [matchDownMD ? 200 : 0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <Box className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <List component="nav" className={classes.navContainer}>
                    <Box sx={{ padding: "12px", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}>
                      <Flex vertical gap="4px 0">
                        <Box sx={{ padding: "12px", background: "#FAFAFA", borderRadius: "8px" }}>
                          <Typography
                            sx={{
                              color: "#4F5A84",
                              lineHeight: "18px",
                              fontSize: "12px",
                            }}
                          >
                            <Trans>Copy Account ID for sending from exchanges and Principal ID for lCP network.</Trans>
                          </Typography>
                        </Box>
                        <Box>
                          <AccountSection />
                        </Box>
                        <Box>
                          <Principal />
                        </Box>
                        {connectorType === Connector.IC ? (
                          <Box sx={{ padding: "12px", background: "rgb(255 210 76 / 15%)", borderRadius: "8px" }}>
                            <Typography
                              sx={{
                                color: "#E8AE00",
                                lineHeight: "16px",
                                fontSize: "12px",
                              }}
                            >
                              <Trans>
                                Internet Identity generates unique Principal IDs and Account IDs for each Dapp. This
                                feature ensures that user identities and account information are isolated across
                                different applications, enhancing security and privacy protection.
                              </Trans>
                            </Typography>
                          </Box>
                        ) : null}
                      </Flex>
                    </Box>

                    <LogOutSection onLogout={() => setOpen(false)}>
                      <Box className={classes.listItem} sx={{ borderRadius: "0 0 12px 12px" }}>
                        <LogoutIcon />
                        <Typography>
                          <Trans>Log Out</Trans>
                        </Typography>
                      </Box>
                    </LogOutSection>
                  </List>
                </ClickAwayListener>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
}
