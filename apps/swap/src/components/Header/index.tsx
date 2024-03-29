import { useState } from "react";
import { Grid, Box, useMediaQuery, Drawer } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import LogoSection from "../LogoSection";
import ProfileSection from "./ProfileSection";
import Navbar from "../Navbar";
import MobileNavbar from "../Navbar/MobileNavbar";
import TokenClaim from "./TokenClaim";

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
      <Grid container>
        <Grid item>
          <Grid container alignItems="center" sx={{ height: "100%" }}>
            {matchDownMD ? (
              <DensityMediumIcon sx={{ cursor: "pointer" }} onClick={handleToggleDrawer} />
            ) : (
              <>
                <Box mr="20px">
                  <LogoSection />
                </Box>
                <Grid item>
                  <Navbar />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
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
          <TokenClaim />
          <ProfileSection />
        </Grid>
      </Grid>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MobileNavbar onPageLoad={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}
