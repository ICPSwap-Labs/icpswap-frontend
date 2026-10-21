import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import ProfileSection from "components/Layout/Header/ProfileSection";
import Navbar from "components/Layout/Navbar";
import MobileNavbar from "components/Layout/Navbar/mobile/Navbar";
import LogoSection from "components/LogoSection";
import { Drawer, useMediaQuery } from "components/Mui";
import { DensityMediumIcon } from "components/MuiIcon";
import { useMediaQuery640 } from "hooks/theme";
import { useState } from "react";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const matchDownMD = useMediaQuery("(max-width:960px)");
  const matchDown640 = useMediaQuery640();
  const matchDown1200 = useMediaQuery("(max-width:1200px)");

  const handleToggleDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      <header className="navbar relative isolate h-19 min-h-19 w-full justify-between gap-3 border-b border-base-content/8 bg-base-100/90 px-6 text-base-content shadow-[0_4px_32px_#00000012] backdrop-blur-2xl max-[960px]:h-16 max-[960px]:min-h-16 max-[640px]:px-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="flex h-full min-w-0 items-center gap-7 max-[1100px]:gap-3">
          {matchDownMD ? (
            <>
              <DensityMediumIcon
                sx={{ cursor: "pointer", fontSize: 21, color: "var(--color-base-content)" }}
                onClick={handleToggleDrawer}
              />
              <LogoSection />
            </>
          ) : (
            <>
              <div className="flex shrink-0 items-center border-r border-base-content/10 pr-7 max-[1100px]:pr-3">
                <LogoSection />
              </div>
              <Navbar />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 max-[640px]:gap-2">
          {!matchDown640 && !matchDown1200 ? (
            <div>
              <CkGlobalEvents />
            </div>
          ) : null}
          <ProfileSection />
        </div>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: "100%",
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "400px",
              background: "var(--color-base-100)",
              borderRight: "1px solid color-mix(in oklab, var(--color-base-content) 10%, transparent)",
            },
          }}
        >
          <MobileNavbar onClose={() => setDrawerOpen(false)} />
        </Drawer>
      </header>
      {!matchDown640 && matchDown1200 ? (
        <div className="hidden w-full justify-center border-b border-base-content/8 bg-base-100/95 py-3 backdrop-blur-xl empty:hidden max-[1200px]:flex">
          <CkGlobalEvents />
        </div>
      ) : null}
    </>
  );
}
