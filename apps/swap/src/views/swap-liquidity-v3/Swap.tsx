import { useState, memo, useCallback } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MainCard } from "components/index";
import SwapSettingIcon from "components/swap/SettingIcon";
import SwapUIWrapper from "components/swap/SwapUIWrapper";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { SwapWrapper, Reclaim, swapContext } from "components/swap/index";
import { Pool } from "@icpswap/swap-sdk";

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
  const [selectedPool, setSelectedPool] = useState<Pool | null | undefined>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const ActiveComponent = () => {
    const Component = SWITCH_BUTTONS.filter((item) => item.id === activeSwitch)[0]?.component;
    return <Component />;
  };

  const handleAddKeys = useCallback(
    (key: string) => {
      setUnavailableBalanceKeys((prevState) => [...new Set([...prevState, key])]);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  const handleRemoveKeys = useCallback(
    (key: string) => {
      const newKeys = [...unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      setUnavailableBalanceKeys(newKeys);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  const handleUpdateRefreshTrigger = useCallback(() => {
    setRefreshTrigger(refreshTrigger + 1);
  }, [refreshTrigger, setRefreshTrigger]);

  return (
    <swapContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        refreshTrigger,
        setRefreshTrigger: handleUpdateRefreshTrigger,
      }}
    >
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
              <Reclaim />
            </Box>
          </Grid>
        </Grid>
      </SwapUIWrapper>
    </swapContext.Provider>
  );
}

export default memo(SwapMain);
