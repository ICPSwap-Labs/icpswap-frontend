import { Box, Typography, Grid } from "@mui/material";
import { t } from "@lingui/macro";
import { Wrapper } from "components/index";
import SwitchComponent from "components/SwitchToggle";
import React from "react";
import { INFO_URL } from "constants/index";

function LinkIcon() {
  return (
    <svg width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.09619 1.5H0.303301V0.5H5.3033H5.8033V1V6H4.8033V2.20711L0.707107 6.3033L0 5.59619L4.09619 1.5Z"
        fill="#4F5A84"
      />
    </svg>
  );
}

type Button = {
  id: number | string;
  value: React.ReactNode;
  path?: string;
  key: string;
};

function SwapWrapper({ children, buttons }: { children: React.ReactNode; buttons: Button[] }) {
  return (
    <Wrapper>
      <SwitchComponent buttons={buttons} />
      <Box mt={4}>{children}</Box>
    </Wrapper>
  );
}

export function SwapV2Wrapper({ children }: { children: React.ReactNode }) {
  const buttons = [
    { id: 3, value: t`Wrap`, path: "/swap/v2/wrap", key: "/wrap" },
    {
      id: 2,
      key: "/swap/v2/liquidity",
      value: t`Liquidity V2`,
      path: "/swap/v2/liquidity",
    },
    {
      id: 4,
      key: "swap-v3",
      value: (
        <Grid container>
          <Typography
            sx={{
              fontWeight: 600,
              "@media (max-width: 640px)": {
                fontSize: "12px",
              },
            }}
          >
            Swap V3
          </Typography>
          <Box sx={{ margin: "0 0 0 3px", position: "relative", top: "-4px" }}>
            <LinkIcon />
          </Box>
        </Grid>
      ),
      path: "/swap",
    },
  ];

  return <SwapWrapper buttons={buttons}>{children}</SwapWrapper>;
}

export default function _SwapWrapper({ children }: { children: React.ReactNode }) {
  const buttons = [
    { id: 1, value: t`Swap V3`, path: "/swap", key: "/swap" },
    {
      id: 2,
      key: "/swap/liquidity",
      value: t`Liquidity`,
      path: "/swap/liquidity",
    },
    {
      id: 3,
      key: "info",
      value: (
        <Grid container>
          <Typography>Info</Typography>
          <Box sx={{ margin: "0 0 0 3px", position: "relative", top: "-4px" }}>
            <LinkIcon />
          </Box>
        </Grid>
      ),
      link: INFO_URL,
    },
  ];

  return <SwapWrapper buttons={buttons}>{children}</SwapWrapper>;
}
