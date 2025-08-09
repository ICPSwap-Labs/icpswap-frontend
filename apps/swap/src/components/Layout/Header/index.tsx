import { useState } from "react";
import { Box, useMediaQuery, Drawer } from "components/Mui";
import { Flex } from "@icpswap/ui";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import LogoSection from "components/LogoSection";
import ProfileSection from "components/Layout/Header/ProfileSection";
import Navbar from "components/Layout/Navbar";
import MobileNavbar from "components/Layout/Navbar/mobile/Navbar";
import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import { useMediaQuery640 } from "hooks/theme";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const matchDownMD = useMediaQuery("(max-width:960px)");
  const matchDown640 = useMediaQuery640();

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
    </>
  );
}
