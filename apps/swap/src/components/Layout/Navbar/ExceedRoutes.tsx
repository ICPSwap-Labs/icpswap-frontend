import { Flex } from "@icpswap/ui";
import { Box, Grid, makeStyles } from "components/Mui";
import { useRef, useState } from "react";
import { ArrowUpRight, MoreHorizontal } from "react-feather";
import { useDesignVersion } from "hooks/useDesignVersion";

import { MAX_NUMBER, type Route } from "./config";
import { ExceedRoutesPopper } from "./ExceedRoutesPopper";

const useStyles = makeStyles(() => {
  return {
    more: {
      padding: "0 12px",
      marginTop: "20px",
      width: "100%",
      height: "42px",
      borderRadius: "5px",
      border: "1px solid color-mix(in oklab, var(--color-base-content) 10%, transparent)",
      cursor: "pointer",
      transition: "background 180ms ease",
      "&:hover": {
        background: "color-mix(in oklab, var(--color-base-content) 4%, transparent)",
        "& .dot": {
          background: "var(--color-primary)",
        },
      },
      "&.classic": {
        width: "auto",
        height: "40px",
        marginTop: 0,
        padding: "0 17px",
        border: "none",
        borderRadius: 0,
        "&:hover": { background: "transparent", "& .dot": { background: "var(--color-base-content)" } },
        "& .dot": {
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          marginRight: "6px",
          "&:last-child": { marginRight: 0 },
        },
        "@media(max-width: 1200px)": { padding: "0 10px" },
      },
    },
    dot: {
      width: "4px",
      height: "4px",
      background: "color-mix(in oklab, var(--color-base-content) 45%, transparent)",
      borderRadius: "0px",
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
  const { isClassicDesign } = useDesignVersion();
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
      className={`${classes.more} ics-terminal-more${isClassicDesign ? " classic" : ""}`}
      aria-label="More"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isClassicDesign ? (
        <MoreHorizontal className="ics-terminal-more-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : null}
      <Flex
        className="ics-terminal-more-expanded"
        fullWidth
        justify={isClassicDesign ? "center" : "space-between"}
        sx={{ height: "100%" }}
      >
        {isClassicDesign ? (
          <>
            <Box component="span" className={`${classes.dot} dot`} />
            <Box component="span" className={`${classes.dot} dot`} />
            <Box component="span" className={`${classes.dot} dot`} />
          </>
        ) : (
          <>
            <Flex>
              <Box component="span" className={`${classes.dot} dot`} />
              <Box component="span" className={`${classes.dot} dot`} />
            </Flex>
            <ArrowUpRight size={14} strokeWidth={1.5} color="var(--color-secondary)" />
            <Box component="span" className={`${classes.dot} dot`} />
          </>
        )}
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
