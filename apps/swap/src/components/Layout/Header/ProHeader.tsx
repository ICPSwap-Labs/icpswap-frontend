import { useState } from "react";
import { Grid, Box, useMediaQuery, Drawer, InputAdornment } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import { ButtonChip } from "components/ButtonChip";
import { FilledTextField } from "components/index";
import { t } from "@lingui/macro";
import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";

import ProfileSection from "./ProfileSection";
import MobileNavbar from "../Navbar/MobileNavbar";
import { ReactComponent as ProLogo } from "./pro-logo.svg";

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      md: 960,
    },
  },
});

export const customizeBreakPoints = customizeTheme.breakpoints;

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const matchDownMD = useMediaQuery(customizeBreakPoints.down("md"));

  const handleToggleDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        {matchDownMD ? (
          <DensityMediumIcon sx={{ cursor: "pointer" }} onClick={handleToggleDrawer} />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ProLogo />
          </Box>
        )}

        <Grid
          item
          xs
          flexWrap="wrap"
          sx={{
            whiteSpace: "nowrap",
            overflow: "auto",
            textAlign: "right",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0 12px",
              justifyContent: "flex-end",
              overflow: "hidden",
              "@media(max-width: 640px)": { gap: "0 8px" },
            }}
          >
            <Box sx={{ width: "358px", height: "32px" }}>
              <FilledTextField
                fullHeight
                contained={false}
                placeholder="Symbol / Name / Canister ID"
                borderRadius="12px"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <ButtonChip label={t`Wallet`} />
            <ButtonChip label={t`Standard Modal`} />
            <ProfileSection />
          </Box>
        </Grid>
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MobileNavbar onPageLoad={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}
