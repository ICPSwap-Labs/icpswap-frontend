import { useState, memo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MainCard } from "components/index";
import SwapSettingIcon from "components/swap/SettingIcon";
import SwapUIWrapper from "components/swap/SwapUIWrapper";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { SwapWrapper } from "components/swap/SwapWrapper";
import { ReclaimLink } from "components/swap/ReclaimLink";

import SwapTransactions from "./swap/Transactions";

const useStyles = makeStyles((theme: Theme) => {
  return {
    outerBox: {
      width: "570px",
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
  { id: 1, value: t`Swap`, component: SwapWrapper },
  { id: 2, value: t`Transactions`, component: SwapTransactions },
];

export function SwapMain() {
  const classes = useStyles();
  const [activeSwitch, setActiveSwitch] = useState(1);

  const ActiveComponent = () => {
    const Component = SWITCH_BUTTONS.filter((item) => item.id === activeSwitch)[0]?.component;
    return <Component />;
  };

  return (
    <SwapUIWrapper>
      <Grid container justifyContent="center">
        <Grid item className={classes.outerBox}>
          <MainCard
            level={1}
            sx={{
              minHeight: "380px",
              padding: activeSwitch === 2 ? "24px 0 0 0" : "24px",
              paddingBottom: activeSwitch === 2 ? "0!important" : "24px",
              overflow: "visible",
              "@media(max-width: 640px)": {
                padding: activeSwitch === 2 ? "16px 0 0 0" : "16px",
                paddingBottom: activeSwitch === 2 ? "0!important" : "16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                padding: activeSwitch === 2 ? "0 24px" : "0",
                "@media(max-width: 640px)": {
                  padding: activeSwitch === 2 ? "0 16px" : "0",
                },
              }}
            >
              <Box>
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
              <SwapSettingIcon type="swap" />
            </Box>
            <Box mt={3}>{ActiveComponent()}</Box>
          </MainCard>

          <Box
            mt="8px"
            sx={{
              background: "#111936",
              padding: "16px",
              borderRadius: "12px",
            }}
          >
            <ReclaimLink />
          </Box>
        </Grid>
      </Grid>
    </SwapUIWrapper>
  );
}

export default memo(SwapMain);
