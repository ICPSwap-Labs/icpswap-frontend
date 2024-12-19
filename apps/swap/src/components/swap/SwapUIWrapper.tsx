import { Box, Typography, Grid } from "components/Mui";
import { t } from "@lingui/macro";
import { Wrapper, TabPanel } from "components/index";
import React from "react";

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

function SwapWrapper({ children, buttons }: { children: React.ReactNode; buttons?: Button[] }) {
  return (
    <Wrapper>
      {buttons ? (
        <Box sx={{ margin: "0 0 16px 0" }}>
          <TabPanel tabs={buttons} />
        </Box>
      ) : null}

      <Box>{children}</Box>
    </Wrapper>
  );
}

export function SwapV2Wrapper({ children }: { children: React.ReactNode }) {
  const buttons = [
    { id: 3, value: t`Wrap`, path: "/swap/v2/wrap", key: "/wrap" },
    {
      id: 4,
      key: "swap-v3",
      value: (
        <Grid container alignItems="center" gap="0 4px">
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

          <LinkIcon />
        </Grid>
      ),
      path: "/swap",
    },
  ];

  return <SwapWrapper buttons={buttons}>{children}</SwapWrapper>;
}

export function SwapUIWrapper({ children }: { children: React.ReactNode }) {
  return <SwapWrapper>{children}</SwapWrapper>;
}
