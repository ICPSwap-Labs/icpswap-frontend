import { useRef, useState } from "react";
import { makeStyles, Box, Grid, Theme } from "components/Mui";
import { Flex } from "@icpswap/ui";

import { Route, MAX_NUMBER } from "./config";
import { ExceedRoutesPopper } from "./ExceedRoutesPopper";

const useStyles = makeStyles((theme: Theme) => {
  return {
    navItem: {
      height: "40px",
      cursor: "pointer",
      padding: "0 16px",
      "&:hover": {
        "& .MuiTypography-root": {
          color: "#FFFFFF",
        },
      },
      "&.active": {
        "& .MuiTypography-root": {
          color: "#FFFFFF",
        },
      },
      [theme.breakpoints.down("md")]: {
        height: "36px",
        padding: "0 12px",
      },
    },
    more: {
      padding: "0 17px",
      cursor: "pointer",
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
      marginRight: "6px",
      "&:last-child": {
        marginRight: "0px",
      },
    },
  };
});

export interface ExceedRoutesProps {
  routes: Route[];
  onMenuClick?: (route: Route) => void;
}

export function ExceedRoutes({ routes, onMenuClick }: ExceedRoutesProps) {
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

  const handleMenuClick = (route: Route) => {
    setOpen(false);
    if (onMenuClick) onMenuClick(route);
  };

  return (
    <Grid
      ref={ref}
      item
      key="more"
      className={classes.more}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex fullWidth justify="center" sx={{ height: "100%" }}>
        <Box component="span" className={`${classes.dot} dot`} />
        <Box component="span" className={`${classes.dot} dot`} />
        <Box component="span" className={`${classes.dot} dot`} />
      </Flex>

      <ExceedRoutesPopper
        open={open}
        anchor={ref?.current}
        onClickAway={handleClose}
        onMenuClick={handleMenuClick}
        routes={routes.filter((route, index) => index > MAX_NUMBER || index === MAX_NUMBER)}
      />
    </Grid>
  );
}
