import { Flex } from "@icpswap/ui";
import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import ProfileSection from "components/Layout/Header/ProfileSection";
import Navbar from "components/Layout/Navbar";
import MobileNavbar from "components/Layout/Navbar/mobile/Navbar";
import LogoSection from "components/LogoSection";
import { Box, Drawer, useMediaQuery } from "components/Mui";
import { DensityMediumIcon } from "components/MuiIcon";
import { useMediaQuery640 } from "hooks/theme";
import { useState } from "react";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const matchDownMD = useMediaQuery("(max-width:960px)");
  const matchDown640 = useMediaQuery640();

  const handleToggleDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <Flex justify="space-between" sx={{ width: "100%", height: "64px", padding: "0 20px", backgroundColor: "#0B132F" }}>
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
        {!matchDown640 ? <CkGlobalEvents /> : null}
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
  );
}
