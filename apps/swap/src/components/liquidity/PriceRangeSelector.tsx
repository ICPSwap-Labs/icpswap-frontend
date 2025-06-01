import React, { useState, useEffect, useCallback } from "react";
import { Typography, TextField, Chip, makeStyles, Theme, useTheme } from "components/Mui";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Token } from "@icpswap/swap-sdk";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { isDarkTheme } from "utils/index";
import { Flex, NumberTextField } from "components/index";
import i18n from "i18n/index";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

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
  const theme = useTheme();
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
    <Flex
      fullWidth
      justify="center"
      align="center"
      sx={{
        border: theme.palette.border.gray200,
        borderRadius: "12px",
        padding: "16px",
      }}
      vertical
      gap="12px 0"
    >
      <Typography align="center" fontSize={12}>
        {label}
      </Typography>

      <Flex fullWidth gap="0 5px">
        <Chip
          className={classes.chip}
          icon={<RemoveIcon />}
          onClick={handleDecreasePrice}
          disabled={decrementDisabled}
        />
        <Flex sx={{ flex: 1 }}>
          {isUpperFullRange ? (
            <TextField
              fullWidth
              value={localValue}
              className={classes.input}
              placeholder="0.0"
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                },
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
        </Flex>
        <Chip className={classes.chip} icon={<AddIcon />} onClick={handleIncreasePrice} disabled={incrementDisabled} />
      </Flex>

      <Typography
        align="center"
        sx={{
          fontSize: "12px",
        }}
      >
        {baseCurrency && quoteCurrency
          ? `${tokenSymbolEllipsis({ symbol: quoteCurrency?.symbol })} per ${tokenSymbolEllipsis({
              symbol: baseCurrency?.symbol,
            })}`
          : ""}
      </Typography>
    </Flex>
  );
}
