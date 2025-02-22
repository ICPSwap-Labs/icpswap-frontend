import React from "react";
import { Box, Grid, Theme, makeStyles } from "components/Mui";
import { isDarkTheme } from "utils";

const useStyles = makeStyles((theme: Theme) => {
  return {
    toggleBox: {
      display: "inline-block",
      padding: "4px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : "#fff",
      borderRadius: `${theme.radius}px`,
    },
    toggleItem: {
      width: "74px",
      height: "32px",
      borderRadius: "6px",
      cursor: "pointer",
      "&.on": {
        backgroundColor: theme.colors.secondaryMain,
        color: "#fff",
      },
      "&.off": {
        backgroundColor: isDarkTheme(theme) ? "#4F5A84" : theme.colors.lightGray200,
      },
    },
  };
});

export enum CHECKED {
  ON = "check",
  OFF = "uncheck",
}

export interface ToggleProps {
  isActive?: boolean;
  checked?: React.ReactChild;
  unchecked?: React.ReactChild;
  onToggleChange: (value?: CHECKED) => void;
}

export default function Toggle({ isActive = false, checked = "On", unchecked = "Off", onToggleChange }: ToggleProps) {
  const classes = useStyles();

  return (
    <Box className={classes.toggleBox}>
      <Grid container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          item
          className={`${classes.toggleItem} ${isActive ? "on" : ""}`}
          onClick={() => onToggleChange(CHECKED.ON)}
        >
          {checked}
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          className={`${classes.toggleItem} ${isActive ? "" : "off"}`}
          onClick={() => onToggleChange(CHECKED.OFF)}
        >
          {unchecked}
        </Grid>
      </Grid>
    </Box>
  );
}
