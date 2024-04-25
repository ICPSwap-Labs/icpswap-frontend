import { Box, InputAdornment } from "components/Mui";
import { FilledTextField } from "components/index";
import { useState } from "react";
import { Search } from "react-feather";
import { TokenSearch } from "./TokenSearch";

export function SearchWrapper() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Box sx={{ width: "100%", height: "40px" }}>
        <FilledTextField
          fullHeight
          contained={false}
          placeholder="Symbol / Name / Canister ID"
          borderRadius="52px"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="#ffffff" size="12px" />
              </InputAdornment>
            ),
          }}
          onFocus={() => setSearchOpen(true)}
        />
      </Box>

      <TokenSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
