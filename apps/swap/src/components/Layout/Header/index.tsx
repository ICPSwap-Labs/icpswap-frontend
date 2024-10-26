import { useState } from "react";
import { Box, useMediaQuery, Drawer } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { createTheme } from "@mui/material/styles";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

import LogoSection from "../../LogoSection";
import ProfileSection from "./ProfileSection";
import Navbar from "../Navbar";
import MobileNavbar from "../Navbar/mobile/Navbar";

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
      <Flex justify="space-between" sx={{ width: "100%" }}>
        <Flex sx={{ height: "100%" }}>
          {matchDownMD ? (
            <DensityMediumIcon sx={{ cursor: "pointer" }} onClick={handleToggleDrawer} />
          ) : (
            <>
              <Box sx={{ margin: "0 20px 0 0" }}>
                <LogoSection />
              </Box>
              <Navbar />
            </>
          )}
        </Flex>

        <Flex
          gap="0 12px"
          justify="flex-end"
          sx={{
            "@media(max-width: 640px)": { gap: "0 8px" },
          }}
        >
          <ProfileSection />
        </Flex>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: "100%",
            "& .MuiPaper-root": {
              width: "100%",
            },
          }}
        >
          <MobileNavbar onClose={() => setDrawerOpen(false)} />
        </Drawer>
      </Flex>
    </>
  );
}
