import { Switch, SwitchProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  const trackBorder =
    theme.customization.mode === "dark" ? `1px solid ${theme.colors.darkTextSecondary}` : "1px solid #EDE7F6";

  const trackActiveBorder =
    theme.customization.mode === "dark" ? `1px solid ${theme.colors.darkSecondaryMain}` : "1px solid #EDE7F6";

  return {
    root: {
      height: 20,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 0,
      color: theme.palette.dark.light,
      top: "50%",
      left: "3px",
      marginTop: "-7px",
      "&$checked": {
        transform: "translateX(15px)",
        color: theme.palette.dark.light,
        "& .MuiSwitch-thumb": {
          background: theme.palette.mode === "dark" ? theme.colors.darkSecondaryMain : theme.colors.lightPrimaryMain,
        },
        "& + $track": {
          backgroundColor: theme.customization.mode === "dark" ? theme.colors.darkLevel3 : "#FAFAFA",
          opacity: 1,
          border: trackActiveBorder,
        },
      },
      "&$focusVisible $thumb": {
        color: "#52d869",
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 14,
      height: 14,
      boxShadow: "none",
    },
    track: {
      borderRadius: 20 / 2,
      border: trackBorder,
      background: theme.palette.mode === "dark" ? theme.colors.darkLevel3 : "#fafafa",
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  };
});

export default function _Switch(props: SwitchProps) {
  const classes = useStyles();

  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
}
