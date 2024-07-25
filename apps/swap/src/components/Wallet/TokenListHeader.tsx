import { Typography, Box, Checkbox, useMediaQuery, useTheme } from "@mui/material";
import AddToken from "components/Wallet/AddToken";
import WalletPageToggle from "components/Wallet/PageToggle";
import { Trans } from "@lingui/macro";
import { SelectSortType } from "components/Wallet/SelectSortType";
import { useWalletSortManager } from "store/wallet/hooks";

interface HideSmallBalanceProps {
  onHideSmallBalances: (checked: boolean) => void;
  isHideSmallBalances: boolean;
}

function HideSmallBalance({ isHideSmallBalances, onHideSmallBalances }: HideSmallBalanceProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
      <Checkbox
        checked={isHideSmallBalances}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onHideSmallBalances(event.target.checked)}
      />
      <Typography sx={{ cursor: "pointer" }} onClick={() => onHideSmallBalances(!isHideSmallBalances)}>
        <Trans>Hide Zero Balance</Trans>
      </Typography>
    </Box>
  );
}

export interface TokenHeaderProps {
  onHideSmallBalances: (checked: boolean) => void;
  onSearchValue: (value: string) => void;
  isHideSmallBalances: boolean;
}

export default function TokenListHeader({ onHideSmallBalances, isHideSmallBalances }: TokenHeaderProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { sort, updateWalletSortType } = useWalletSortManager();

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

              <HideSmallBalance onHideSmallBalances={onHideSmallBalances} isHideSmallBalances={isHideSmallBalances} />
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
          <HideSmallBalance onHideSmallBalances={onHideSmallBalances} isHideSmallBalances={isHideSmallBalances} />
        </Box>
      ) : null}
    </Box>
  );
}
