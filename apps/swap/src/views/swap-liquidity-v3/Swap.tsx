import { useState, memo } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Box, Typography, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MainCard } from "components/index";
import SwapSettingIcon from "components/swap/SettingIcon";
import SwapWrapper from "components/swap/SwapWrapper";
import { t, Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import SwapTransactions from "./swap/Transactions";
import Swap from "./swap/index";

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
  { id: 1, value: t`Swap`, component: Swap },
  { id: 2, value: t`Transactions`, component: SwapTransactions },
];

function QuestionMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_31135_78814)">
        <path
          d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346625 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM8 13.6C7.77397 13.6 7.55301 13.533 7.36507 13.4074C7.17712 13.2818 7.03064 13.1033 6.94414 12.8945C6.85764 12.6857 6.83501 12.4559 6.87911 12.2342C6.9232 12.0125 7.03205 11.8089 7.19188 11.649C7.35171 11.4892 7.55535 11.3803 7.77704 11.3362C7.99874 11.2921 8.22853 11.3148 8.43736 11.4013C8.64619 11.4878 8.82468 11.6343 8.95025 11.8222C9.07583 12.0101 9.14286 12.2311 9.14286 12.4571C9.14286 12.7602 9.02245 13.0509 8.80813 13.2653C8.5938 13.4796 8.30311 13.6 8 13.6ZM11.12 7.05143C10.6991 7.612 10.203 8.11194 9.64572 8.53714C9.35305 8.75004 9.10462 9.01788 8.91429 9.32571C8.79994 9.66763 8.75715 10.0294 8.78858 10.3886H7.10858V9.94286C7.09373 9.48179 7.1877 9.0237 7.38286 8.60571C7.6639 8.15904 8.0287 7.77096 8.45715 7.46286C8.80313 7.2033 9.12796 6.91669 9.42858 6.60571C9.5858 6.40314 9.67033 6.15357 9.66858 5.89714C9.66884 5.72038 9.63004 5.54574 9.55497 5.38571C9.47989 5.22569 9.37039 5.08422 9.23429 4.97143C8.91409 4.70575 8.50721 4.56741 8.09143 4.58286C7.67532 4.57781 7.27072 4.71942 6.94858 4.98286C6.61703 5.31837 6.39062 5.74337 6.29715 6.20571C6.24 6.54857 4.58286 6.69714 4.59429 6C4.6193 5.61624 4.72122 5.24143 4.894 4.89784C5.06677 4.55426 5.30686 4.24893 5.6 4C6.26375 3.42013 7.11874 3.10664 8 3.12C8.9202 3.07168 9.8252 3.36927 10.5371 3.95429C10.8194 4.19274 11.0455 4.49046 11.1996 4.82626C11.3537 5.16207 11.4319 5.5277 11.4286 5.89714C11.4388 6.30357 11.3317 6.70434 11.12 7.05143Z"
          fill="#EFEFFF"
        />
      </g>
      <defs>
        <clipPath id="clip0_31135_78814">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function SwapMain() {
  const classes = useStyles();
  const history = useHistory();
  const [activeSwitch, setActiveSwitch] = useState(1);

  const ActiveComponent = () => {
    const Component = SWITCH_BUTTONS.filter((item) => item.id === activeSwitch)[0]?.component;
    return <Component />;
  };

  return (
    <SwapWrapper>
      <Grid container justifyContent="center">
        <Grid item className={classes.outerBox}>
          <MainCard
            level={1}
            contentSX={{
              minHeight: "380px",
              padding: activeSwitch === 2 ? "24px 0 0 0" : "24px",
              paddingBottom: activeSwitch === 2 ? "0!important" : "24px",
            }}
            sx={{
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                padding: activeSwitch === 2 ? "0 24px" : "0",
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
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => history.push("/swap/reclaim")}
          >
            <Typography color="secondary" mr="5px">
              <Trans>Unreceived tokens after swap? Reclaim here</Trans>
            </Typography>

            <Tooltip
              PopperProps={{
                // @ts-ignore
                sx: {
                  "& .MuiTooltip-tooltip": {
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    "& .MuiTooltip-arrow": {
                      color: "#ffffff",
                    },
                  },
                },
              }}
              title={
                <Box>
                  <Typography color="text.400" fontSize="14px">
                    <Trans>
                      For your funds' safety on ICPSwap, we've implemented the 'Reclaim Your Tokens' feature. If issues
                      arise with the token canister during swaps, liquidity withdrawals, or fee claims, or if
                      significant slippage causes swap failures, utilize this feature to directly reclaim your tokens.
                    </Trans>
                  </Typography>
                </Box>
              }
              arrow
            >
              <Box sx={{ width: "16px", height: "16px" }}>
                <QuestionMark />
              </Box>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </SwapWrapper>
  );
}

export default memo(SwapMain);
