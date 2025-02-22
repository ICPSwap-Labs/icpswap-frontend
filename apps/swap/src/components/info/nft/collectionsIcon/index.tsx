import { FC, useRef, useState } from "react";
import {
  Grid,
  Box,
  MenuList,
  MenuItem,
  Popper,
  useMediaQuery,
  makeStyles,
  useTheme,
  Theme,
  ClickAwayListener,
} from "components/Mui";
import { mockALinkAndOpen } from "@icpswap/utils";
import DiscordIcon from "./Discord";
import TwitterIcon from "./Twitter";
import TelegramIcon from "./Telegram";
import DistriktIcon from "./Distrikt";
import DscvrIcon from "./Dscvr";
import InstagramIcon from "./Instagram";
import MediumIcon from "./Medium";
import WebsiteIcon from "./Website";
import OtherIcon from "./Other";
import GithubIcon from "./Github";

const LINKS_MAX_NUMBER = 5;

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "inline-block",
      background: theme.palette.background.level3,
      border: `1px solid ${theme.palette.background.level4}`,
      borderRadius: "12px",
      height: "50px",
      overflow: "hidden",
      [theme.breakpoints.down("md")]: {
        height: "38px",
      },
    },
    icon: {
      cursor: "pointer",
      width: "50px",
      height: "100%",
      borderRight: `1px solid rgba(255, 255, 255, 0.04)`,
      "&:last-child": {
        borderRight: "none",
      },
      "&:hover": {
        background: "#313D67",
      },
      [theme.breakpoints.down("md")]: {
        width: "38px",
      },
    },
    popper: {
      zIndex: 1101,
    },
    menu: {
      padding: 0,
      background: theme.colors.darkLevel3,
      border: `1px solid ${theme.palette.background.level4}`,
      borderRadius: "8px",
      overflow: "hidden",
      "& .MuiMenuItem-root.MuiButtonBase-root": {
        background: theme.colors.darkLevel3,
        paddingTop: "10px",
        paddingBottom: "10px",
        borderBottom: `1px solid rgba(255, 255, 255, 0.04)`,
        [theme.breakpoints.down("md")]: {
          paddingLeft: "8px",
          paddingRight: "8px",
          minHeight: "38px",
        },
        "&:first-of-type": {
          borderRadius: "8px 8px 0 0",
        },
        "&:last-child": {
          borderRadius: "0 0 8px 8px",
          borderBottom: "none",
        },
        "&.active": {
          background: "#313D67",
        },
        "&:hover": {
          background: "#313D67",
        },
      },
    },
    more: {
      "&:hover": {
        "& .dot": {
          background: "#fff",
        },
      },
    },
    dot: {
      width: "5px",
      height: "5px",
      background: theme.colors.darkTextSecondary,
      borderRadius: "50%",
      marginBottom: "3px",
      "&:last-child": {
        marginBottom: "0px",
      },
      [theme.breakpoints.down("md")]: {
        width: "4px",
        height: "4px",
        marginBottom: "2px",
        "&:last-child": {
          marginBottom: "0px",
        },
      },
    },
  };
});

export const Icons: { [key: string]: FC<{ width?: number }> } = {
  Website: WebsiteIcon,
  Discord: DiscordIcon,
  Twitter: TwitterIcon,
  Dscvr: DscvrIcon,
  Distrikt: DistriktIcon,
  Telegram: TelegramIcon,
  Instagram: InstagramIcon,
  Medium: MediumIcon,
  Other: OtherIcon,
  Github: GithubIcon,
};

export type Link = { k: string; v: string };

export function LinkIcon({ k }: { k: string }) {
  const Icon = Icons[k];
  const theme = useTheme() as Theme;

  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return Icon ? <Icon width={matchDownMd ? 24 : 28} /> : null;
}

export function LinkItem({ link, onClick }: { link: Link; onClick: (link: string) => void }) {
  const handleIconClick = () => {
    onClick(link.v);
  };

  return (
    <Grid container item justifyContent="center" alignItems="center" onClick={handleIconClick}>
      <LinkIcon k={link.k} />
    </Grid>
  );
}

export default function CollectionIcons({ links }: { links: Link[] | undefined }) {
  const classes = useStyles();

  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadLink = (link: string) => {
    mockALinkAndOpen(link, "NFT_LINK");
  };

  return (links ?? []).length > 0 ? (
    <Box className={classes.wrapper}>
      <Grid container sx={{ height: "100%" }} alignItems="center">
        {(links ?? []).map((link, index) =>
          index < LINKS_MAX_NUMBER ? (
            <Grid key={link.k} className={classes.icon} container justifyContent="center" alignItems="center">
              <LinkItem link={link} onClick={handleLoadLink} />
            </Grid>
          ) : null,
        )}

        {(links?.length ?? 0) > LINKS_MAX_NUMBER ? (
          <Grid
            ref={ref}
            container
            alignItems="center"
            key="more"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={classes.icon}
          >
            <Grid container item justifyContent="center" alignItems="center" className={classes.more}>
              <Box>
                <Box className={`${classes.dot} dot`} />
                <Box className={`${classes.dot} dot`} />
                <Box className={`${classes.dot} dot`} />
              </Box>
            </Grid>

            <Popper
              open={open}
              anchorEl={ref?.current}
              placement="top"
              popperOptions={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 2],
                    },
                  },
                ],
              }}
              className={classes.popper}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} className={classes.menu}>
                  {(links ?? ([] as Link[])).map((link, index) => {
                    if (index >= LINKS_MAX_NUMBER) {
                      return (
                        <MenuItem key={`${link.k}`} onClick={() => handleLoadLink(link.v)}>
                          <LinkIcon k={link.k} />
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </MenuList>
              </ClickAwayListener>
            </Popper>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  ) : null;
}
