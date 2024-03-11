import { ButtonBase, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Token } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils";
import { Theme } from "@mui/material/styles";

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

export default function TokenToggle({
  currencyA,
  currencyB,
  handleToggle,
}: {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  handleToggle: () => void;
}) {
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
