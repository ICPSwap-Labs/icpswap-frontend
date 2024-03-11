import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CurrencyAvatar from "components/CurrencyAvatar";
import { Currency } from "@icpswap/swap-sdk";

const useStyles = makeStyles(() => {
  return {
    floatLeft: {
      float: "left",
    },
    avatarBox: {
      clear: "both",
      overflow: "hidden",
      "& .currencyB": {
        marginLeft: "-8px",
        float: "left",
      },
      "& .currencyA ": {
        float: "left",
      },
    },
  };
});

export interface CurrenciesAvatarProps {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  borderColor: string;
  bgColor: string;
  className?: any;
  size?: string;
}

export default function CurrenciesAvatar({
  currencyA,
  currencyB,
  borderColor = "#ffffff",
  bgColor = "#97a4ef",
  size,
}: CurrenciesAvatarProps) {
  const classes = useStyles();

  return (
    <Box className={classes.avatarBox}>
      <CurrencyAvatar
        className="currencyA"
        borderColor={borderColor}
        bgColor={bgColor}
        currency={currencyA}
        size={size}
      />
      <CurrencyAvatar
        className="currencyB"
        borderColor={borderColor}
        bgColor={bgColor}
        currency={currencyB}
        size={size}
      />
    </Box>
  );
}
