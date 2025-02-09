import { useState } from "react";
import { Grid, Box, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import Exchange from "components/Wrap/Exchange";
import Record from "components/Wrap/Record";
import RetryWrap from "components/Wrap/RetryWrap";
import { TextButton, MainCard } from "components/index";
import { SwapV2Wrapper } from "components/swap/SwapUIWrapper";
import { INFO_URL } from "constants/index";
import WrapContext from "components/Wrap/context";
import { infoRoutesConfigs } from "routes/info.config";
import { Flex, Link } from "@icpswap/ui";
import { ArrowUpRight } from "react-feather";
import i18n from "i18n/index";

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
  { id: 1, value: i18n.t("common.wrap"), component: Exchange },
  { id: 2, value: i18n.t("common.transactions"), component: Record },
];

export default function Wrap() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeSwitch, setActiveSwitch] = useState(1);
  const [retryTrigger, setRetryTrigger] = useState(false);

  const ActiveComponent = () => {
    const Component = SWITCH_BUTTONS.filter((item) => item.id === activeSwitch)[0]?.component;
    return <Component />;
  };

  return (
    <WrapContext.Provider value={{ retryTrigger, setRetryTrigger }}>
      <SwapV2Wrapper>
        <Grid container justifyContent="center">
          <Grid item className={classes.outerBox}>
            <MainCard level={1}>
              <Flex
                fullWidth
                justify="space-between"
                sx={{
                  position: "relative",
                }}
              >
                <Flex gap="0 24px">
                  {SWITCH_BUTTONS.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
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
                </Flex>

                <Flex gap="0 4px">
                  <Link link={`${INFO_URL}${infoRoutesConfigs.INFO_WRAP}`}>
                    <Typography color="text.theme-secondary">{i18n.t("wrap.info")}</Typography>
                  </Link>
                  <ArrowUpRight size="16px" color={theme.colors.secondaryMain} />
                </Flex>
              </Flex>
              <Box mt={4}>{ActiveComponent()}</Box>
            </MainCard>
            <Box
              mt="20px"
              sx={{
                textAlign: "center",
              }}
            >
              <RetryWrap onRetrySuccess={() => setRetryTrigger(!retryTrigger)}>
                {({ onClick }: { onClick: () => void }) => (
                  <TextButton onClick={onClick}>{i18n.t("wrap.button")}</TextButton>
                )}
              </RetryWrap>
            </Box>
          </Grid>
        </Grid>
      </SwapV2Wrapper>
    </WrapContext.Provider>
  );
}
