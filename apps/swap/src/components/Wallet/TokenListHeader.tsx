import { useState } from "react";
import { InputAdornment, OutlinedInput, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Switch from "components/switch";
import { IconSearch } from "@tabler/icons";
import AddToken from "components/Wallet/AddToken";
import WalletPageToggle from "components/Wallet/PageToggle";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  headerBox: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "auto",
      gridTemplateRows: "1fr 4fr",
      gridGap: "20px 0",
    },
  },
  box: {
    position: "absolute",
    right: "0",
    display: "grid",
    gridGap: "0 24px",
    width: "fit-content",
    [theme.breakpoints.down("md")]: {
      position: "static",
      right: "0",
      gridGap: "12px 0",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "auto auto",
      width: "auto",
    },
  },
  actions: {
    position: "relative",
  },
  smallBalance: {
    gridArea: "1 / 1 / auto / auto",
    [theme.breakpoints.down("md")]: {
      gridArea: "2 / 1 / auto / 3",
    },
  },
  searchInput: {
    gridArea: "1 / 2 / auto / auto",
    [theme.breakpoints.down("md")]: {
      gridArea: "1 / 1 / auto / 4",
    },
  },
  addToken: {
    gridArea: "1 / 3 / auto / auto",
    [theme.breakpoints.down("md")]: {
      gridArea: "2 / 3 / auto / 4",
    },
    [theme.breakpoints.down("sm")]: {
      gridArea: "3 / 1 / auto / 4",
    },
  },
}));

export interface TokenHeaderProps {
  onHideSmallBalances: (checked: boolean) => void;
  onSearchValue: (value: string) => void;
  isHideSmallBalances: boolean;
}

export default function TokenListHeader({ onHideSmallBalances, onSearchValue, isHideSmallBalances }: TokenHeaderProps) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValue(e.target.value);
    setSearchValue(e.target.value);
  };

  return (
    <Box className={classes.headerBox}>
      <WalletPageToggle />

      <Box className={classes.actions}>
        <Box className={classes.box}>
          <Box className={classes.smallBalance}>
            <Typography display="inline">
              <Trans>Hide Zero Balance</Trans>
            </Typography>
            <Switch
              checked={isHideSmallBalances}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onHideSmallBalances(event.target.checked)}
            />
          </Box>

          <Box className={classes.searchInput}>
            <OutlinedInput
              fullWidth
              id="input-search-list-style2"
              placeholder={t`Search by symbol`}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="1rem" />
                </InputAdornment>
              }
              size="small"
              value={searchValue}
              inputProps={{
                maxLength: 20,
              }}
              onChange={handleSearchValue}
            />
          </Box>
          <Box className={classes.addToken}>
            <AddToken />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
