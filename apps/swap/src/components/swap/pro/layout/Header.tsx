import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";
import { ButtonChip } from "components/ButtonChip";
import { FilledTextField } from "components/index";
import ProfileSection from "components/Layout/Header/ProfileSection";
import { Box, Grid, InputAdornment } from "components/Mui";
import { ReactComponent as MobileSearchIcon } from "components/swap/pro/layout/mobile-search.svg";
import { ReactComponent as ProLogo } from "components/swap/pro/layout/pro-logo.svg";
import { TokenSearch } from "components/swap/pro/layout/TokenSearch";
import { useMediaQueryMD } from "hooks/theme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const matchDownSM = useMediaQueryMD();

  const handleLoadPage = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {matchDownSM ? <MobileSearchIcon onClick={() => setSearchOpen(true)} /> : <ProLogo />}
        </Box>

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
            {matchDownSM ? null : (
              <Box sx={{ width: "358px", height: "32px" }}>
                <FilledTextField
                  fullHeight
                  placeholder="Symbol / Name / Canister ID"
                  borderRadius="12px"
                  textFieldProps={{
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
              </Box>
            )}
            <ButtonChip label={t`Wallet`} onClick={() => handleLoadPage("/wallet")} />
            <ButtonChip label={t`Simple mode`} onClick={() => handleLoadPage("/swap")} />
            <ProfileSection />
          </Box>
        </Grid>
      </Box>

      <TokenSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
