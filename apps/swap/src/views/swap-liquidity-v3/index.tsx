import { useState, memo, useCallback } from "react";
import { Grid, Box, Typography, makeStyles, Theme } from "components/Mui";
import { MainCard } from "components/index";
import SwapSettingIcon from "components/swap/SettingIcon";
import { t } from "@lingui/macro";
import { SwapWrapper, Reclaim, SwapContext, SwapUIWrapper } from "components/swap/index";
import { Pool } from "@icpswap/swap-sdk";
import { useConnectorStateConnected } from "store/auth/hooks";
import { SWAP_REFRESH_KEY } from "constants/index";

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
  const [usdValueChange, setUSDValueChange] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null | undefined>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);

  const isConnected = useConnectorStateConnected();

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

  return (
    <SwapContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        usdValueChange,
        setUSDValueChange,
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

            {isConnected ? (
              <Box
                mt="8px"
                sx={{
                  background: "#111936",
                  padding: "16px",
                  borderRadius: "16px",
                }}
              >
                <Reclaim pool={selectedPool} refreshKey={SWAP_REFRESH_KEY} />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </SwapUIWrapper>
    </SwapContext.Provider>
  );
}

export default memo(SwapMain);
