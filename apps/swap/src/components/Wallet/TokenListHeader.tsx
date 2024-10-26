import { Box, useMediaQuery, useTheme } from "@mui/material";
import AddToken from "components/Wallet/AddToken";
import WalletPageToggle from "components/Wallet/PageToggle";
import { SelectSortType } from "components/Wallet/SelectSortType";
import { useWalletSortManager, useSortBalanceManager } from "store/wallet/hooks";
import { SortBalance } from "components/Wallet/SortBalance";

export interface TokenHeaderProps {
  onHideSmallBalances: (checked: boolean) => void;
  onSearchValue: (value: string) => void;
  isHideSmallBalances: boolean;
}

export default function TokenListHeader() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { sort, updateWalletSortType } = useWalletSortManager();
  const { sortBalance, updateSortBalance } = useSortBalanceManager();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <WalletPageToggle />

        <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
          {!matchDownSM ? (
            <>
              <Box>
                <SelectSortType value={sort} onChange={updateWalletSortType} />
              </Box>

              <Box>
                <SortBalance value={sortBalance} onChange={updateSortBalance} />
              </Box>
            </>
          ) : null}

          <AddToken />
        </Box>
      </Box>

      {matchDownSM ? (
        <Box sx={{ margin: "10px 0 0 0", display: "flex", justifyContent: "space-between" }}>
          <Box>
            <SelectSortType value={sort} onChange={updateWalletSortType} />
          </Box>

          <Box>
            <SortBalance value={sortBalance} onChange={updateSortBalance} />
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
