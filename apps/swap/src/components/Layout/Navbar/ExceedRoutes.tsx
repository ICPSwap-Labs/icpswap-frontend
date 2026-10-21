import { Flex } from "@icpswap/ui";
import { Box, Grid, makeStyles, type Theme } from "components/Mui";
import { useRef, useState } from "react";

import { MAX_NUMBER, type Route } from "./config";
import { ExceedRoutesPopper } from "./ExceedRoutesPopper";

const useStyles = makeStyles((theme: Theme) => {
  return {
    navItem: {
      height: "40px",
      cursor: "pointer",
      padding: "0 16px",
      "&:hover": {
        "& .MuiTypography-root": {
          color: "var(--color-base-content)",
        },
      },
      "&.active": {
        "& .MuiTypography-root": {
          color: "var(--color-base-content)",
        },
      },
      [theme.breakpoints.down("md")]: {
        height: "36px",
        padding: "0 12px",
      },
    },
    more: {
      padding: "0 12px",
      height: "40px",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "background 180ms ease",
      "&:hover": {
        background: "color-mix(in oklab, var(--color-base-content) 5%, transparent)",
        "& .dot": {
          background: "var(--color-primary)",
        },
      },
    },
    dot: {
      width: "4px",
      height: "4px",
      background: "color-mix(in oklab, var(--color-base-content) 45%, transparent)",
      borderRadius: "50%",
      marginRight: "4px",
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
        routes={routes.filter((_route, index) => index >= MAX_NUMBER)}
      />
    </Grid>
  );
}
