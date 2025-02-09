import { useState, memo } from "react";
import { Grid, Box, Typography, makeStyles, Theme } from "components/Mui";
import { MainCard } from "components/index";
import i18n from "i18n/index";

import Exchange from "./Exchange";
import Record from "./Record";

const useStyles = makeStyles((theme: Theme) => {
  return {
    outerBox: {
      width: "570px",
      overflow: "hidden",
    },
    activeTypography: {
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-6px",
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: theme.colors.secondaryMain,
      },
    },
  };
});

const SWITCH_BUTTONS = [
  { id: 1, value: i18n.t("wrap.exchange"), component: Exchange },
  { id: 2, value: i18n.t("common.record"), component: Record },
];

export default memo(() => {
  const classes = useStyles();
  const [activeSwitch, setActiveSwitch] = useState(1);

  const ActiveComponent = () => {
    const Component = SWITCH_BUTTONS.filter((item) => item.id === activeSwitch)[0]?.component;
    return <Component />;
  };

  return (
    <Grid container justifyContent="center">
      <Grid item className={classes.outerBox}>
        <MainCard level={1} sx={{ width: "570px" }}>
          <Box
            sx={{
              position: "relative",
            }}
          >
            {SWITCH_BUTTONS.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "inline-block",
                  marginRight: "32px",
                  cursor: "pointer",
                }}
                onClick={() => setActiveSwitch(item.id)}
              >
                <Typography
                  className={item.id === activeSwitch ? classes.activeTypography : ""}
                  color={activeSwitch === item.id ? "textPrimary" : "textSecondary"}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box mt={5}>{ActiveComponent()}</Box>
        </MainCard>
      </Grid>
    </Grid>
  );
});
