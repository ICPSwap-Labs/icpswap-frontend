import { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Exchange from "components/Wrap/Exchange";
import Record from "components/Wrap/Record";
import RetryWrap from "components/Wrap/RetryWrap";
import { TextButton, MainCard } from "components/index";
import { SwapV2Wrapper } from "components/swap/SwapUIWrapper";
import { t, Trans } from "@lingui/macro";
import { INFO_URL } from "constants/index";
import WrapContext from "components/Wrap/context";
import { Theme } from "@mui/material/styles";
import LinkIcon from "assets/images/LinkIcon";

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
  { id: 1, value: t`Wrap`, component: Exchange },
  { id: 2, value: t`Transactions`, component: Record },
];

export default function Wrap() {
  const classes = useStyles();
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
              <Grid
                container
                sx={{
                  position: "relative",
                }}
              >
                <Grid item xs>
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
                </Grid>
                <TextButton link={`${INFO_URL}/wrap`}>
                  WICP Info <LinkIcon />
                </TextButton>
              </Grid>
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
                  <TextButton onClick={onClick}>
                    <Trans>Retry any of your failed wrap</Trans>
                  </TextButton>
                )}
              </RetryWrap>
            </Box>
          </Grid>
        </Grid>
      </SwapV2Wrapper>
    </WrapContext.Provider>
  );
}
