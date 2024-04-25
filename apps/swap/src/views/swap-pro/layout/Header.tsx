import { Grid, Box, InputAdornment, useMediaQuery, useTheme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ButtonChip } from "components/ButtonChip";
import { FilledTextField } from "components/index";
import { t } from "@lingui/macro";
import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";
import { useHistory } from "react-router-dom";
import ProfileSection from "components/Layout/Header/ProfileSection";
import { useState } from "react";

import { ReactComponent as ProLogo } from "./pro-logo.svg";
import { ReactComponent as MobileSearchIcon } from "./mobile-search.svg";

import { TokenSearch } from "./TokenSearch";

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      md: 960,
    },
  },
});

export default function Header() {
  const theme = useTheme();
  const history = useHistory();
  const [searchOpen, setSearchOpen] = useState(false);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const handleLoadPage = (path: string) => {
    history.push(path);
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
