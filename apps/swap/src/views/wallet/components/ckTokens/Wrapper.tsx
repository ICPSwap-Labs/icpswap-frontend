import { Box } from "@mui/material";
import React from "react";
import { MainCard } from "components/index";

export interface WrapperProps {
  main: React.ReactNode;
  logo: React.ReactNode;
  transactions?: React.ReactNode;
}

export function Wrapper({ main, logo, transactions }: WrapperProps) {
  return (
    <>
      <MainCard
        sx={{
          padding: "40px",
          "@media(max-width: 980px)": {
            padding: "12px",
          },
        }}
      >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "grid",
              gap: "0 12px",
              gridTemplateColumns: "564px auto",
              "@media(max-width: 980px)": {
                gridTemplateColumns: "minmax(100%, 564px)",
                gap: "12px 0",
              },
            }}
          >
            <Box
              sx={{
                maxWidth: "564px",
                width: "100%",
              }}
            >
              {main}
            </Box>

            <Box
              sx={{
                "@media(max-width: 980px)": {
                  gridArea: "1 / auto",
                },
              }}
            >
              {logo}
            </Box>
          </Box>
        </Box>
      </MainCard>

      {transactions ? <Box sx={{ margin: "20px 0 0 0" }}>{transactions}</Box> : null}
    </>
  );
}
