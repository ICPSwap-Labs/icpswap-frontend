import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, TextField, Chip, makeStyles, Theme } from "components/Mui";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Token } from "@icpswap/swap-sdk";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { isDarkTheme } from "utils/index";
import { NumberTextField } from "components/index";
import i18n from "i18n/index";

const usePriceRangeInputStyle = makeStyles((theme: Theme) => {
  return {
    inputContainer: {
      border: theme.palette.border.gray200,
      borderRadius: "12px",
    },
    input: {
      "& input": {
        fontSize: "20px!important",
        fontWeight: 700,
        textAlign: "center",
        height: "28px",
        padding: "0 0",
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
    },
    chip: {
      width: "28px",
      height: "28px",
      borderRadius: "8px",
      "& .MuiSvgIcon-root": {
        marginLeft: "17px",
        color: isDarkTheme(theme) ? "#e0e0e0" : theme.colors.darkLevel1,
      },
    },
  };
});

export interface PriceRangeSelectorProps {
  label: React.ReactChild;
  value: string;
  increment: () => string;
  decrement: () => string;
  onRangeInput: (value: string) => void;
  isUpperFullRange?: boolean | undefined;
  incrementDisabled?: boolean;
  decrementDisabled?: boolean;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
}

export function PriceRangeSelector({
  label = i18n.t("common.min.price"),
  value,
  increment,
  decrement,
  onRangeInput,
  isUpperFullRange,
  incrementDisabled,
  decrementDisabled,
  baseCurrency,
  quoteCurrency,
}: PriceRangeSelectorProps) {
  const classes = usePriceRangeInputStyle();

  const [localValue, setLocalValue] = useState("");
  const [useLocalValue, setUseLocalValue] = useState(false);

  const handleOnFocus = useCallback(() => {
    setUseLocalValue(true);
  }, []);

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(localValue); // trigger update on parent value
  }, [localValue, onRangeInput]);

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value); // reset local value to match parent
      }, 0);
    }
  }, [localValue, useLocalValue, value]);

  const handleIncreasePrice = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(increment());
  }, [increment, onRangeInput]);

  const handleDecreasePrice = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(decrement());
  }, [decrement, onRangeInput]);

  return (
    <Grid className={classes.inputContainer} container alignItems="center" justifyContent="center" sx={{ p: 2 }}>
      <Typography align="center" fontSize={12}>
        {label}
      </Typography>
      <Grid container mt="12px" mb="12px">
        <Chip
          className={classes.chip}
          icon={<RemoveIcon />}
          onClick={handleDecreasePrice}
          disabled={decrementDisabled}
        />
        <Grid item xs ml="5px" mr="5px">
          {isUpperFullRange ? (
            <TextField
              fullWidth
              value={localValue}
              className={classes.input}
              placeholder="0.0"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
            />
          ) : (
            <NumberTextField
              fullWidth
              value={localValue}
              className={classes.input}
              placeholder="0.0"
              variant="standard"
              numericProps={{
                thousandSeparator: true,
                decimalScale: 8,
                allowNegative: false,
                maxLength: MAX_SWAP_INPUT_LENGTH,
              }}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
            />
          )}
        </Grid>
        <Chip className={classes.chip} icon={<AddIcon />} onClick={handleIncreasePrice} disabled={incrementDisabled} />
      </Grid>
      <Typography
        align="center"
        sx={{
          fontSize: "12px",
        }}
      >
        {baseCurrency && quoteCurrency ? `${quoteCurrency?.symbol} per ${baseCurrency?.symbol}` : ""}
      </Typography>
    </Grid>
  );
}
