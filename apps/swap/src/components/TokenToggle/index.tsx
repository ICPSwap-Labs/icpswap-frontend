import { ButtonBase, Grid, makeStyles, Theme } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils";

const useStyle = makeStyles((theme: Theme) => ({
  container: {
    background: isDarkTheme(theme) ? theme.palette.background.level3 : "#fff",
    border: theme.palette.border.gray200,
    borderRadius: "8px",
    padding: "2px",
  },
  item: {
    borderRadius: "6px",
    "&.active": {
      background: isDarkTheme(theme) ? theme.palette.background.level1 : "#EFEFEF",
    },
  },
  buttonBase: {
    lineHeight: "20px",
    padding: "2.5px 12px",
  },
}));

export interface TokenToggleProps {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  handleToggle: () => void;
}

export function TokenToggle({ currencyA, currencyB, handleToggle }: TokenToggleProps) {
  const classes = useStyle();

  const isSorted = currencyA && currencyB && currencyA.sortsBefore(currencyB);

  return currencyA && currencyB ? (
    <Grid container className={classes.container} onClick={handleToggle}>
      <Grid className={`${classes.item}${isSorted ? " active" : ""}`}>
        <ButtonBase className={classes.buttonBase}>{isSorted ? currencyA.symbol : currencyB.symbol}</ButtonBase>
      </Grid>
      <Grid className={`${classes.item}${!isSorted ? " active" : ""}`}>
        <ButtonBase className={classes.buttonBase}>{isSorted ? currencyB.symbol : currencyA.symbol}</ButtonBase>
      </Grid>
    </Grid>
  ) : null;
}
