import { useContext } from "react";
import { Typography, Box, Checkbox } from "@mui/material";
import AddToken from "components/Wallet/AddToken";
import WalletPageToggle from "components/Wallet/PageToggle";
import { Trans } from "@lingui/macro";
import { ReactComponent as RefreshCircleIcon } from "assets/icons/refresh-circle.svg";
import WalletContext from "./context";

export interface TokenHeaderProps {
  onHideSmallBalances: (checked: boolean) => void;
  onSearchValue: (value: string) => void;
  isHideSmallBalances: boolean;
}

export default function TokenListHeader({ onHideSmallBalances, isHideSmallBalances }: TokenHeaderProps) {
  const { refreshCounter, setRefreshCounter } = useContext(WalletContext);

  const handleRefresh = () => {
    setRefreshCounter(refreshCounter + 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "20px 0",
        },
      }}
    >
      <WalletPageToggle />

      <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
        <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
          <Checkbox
            checked={isHideSmallBalances}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onHideSmallBalances(event.target.checked)}
          />
          <Typography sx={{ cursor: "pointer" }} onClick={() => onHideSmallBalances(!isHideSmallBalances)}>
            <Trans>Hide Zero Balance</Trans>
          </Typography>
        </Box>

        <RefreshCircleIcon style={{ cursor: "pointer" }} onClick={handleRefresh} />

        <AddToken />
      </Box>
    </Box>
  );
}
