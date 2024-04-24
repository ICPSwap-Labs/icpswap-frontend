import { Override } from "@icpswap/types";
import { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { TextField, TextFieldProps } from "@mui/material";

export type NumericProps = {
  decimalScale?: number;
  allowNegative?: boolean;
  maxLength?: number;
  thousandSeparator?: boolean;
};

type InputProps = {
  onChange: (event: { target: { value: string } }) => void;
  name: string;
  value: any;
};

export const TextFieldNumberComponent = forwardRef<NumericFormatProps, InputProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      type="text"
      inputMode="decimal"
      getInputRef={ref}
      onValueChange={(values) => {
        // Fix outside value change cause to maximum update
        if (values.value === props.value) return;

        onChange({
          target: {
            // Fix if user typed . first could case some NaN errors
            value: values.value === "." ? "0." : values.value,
          },
        });
      }}
    />
  );
});

export type NumberTextFieldProps = Override<TextFieldProps, { numericProps: NumericProps }>;

export default function NumberTextField(props: NumberTextFieldProps) {
  const { numericProps, ...textFiledProps } = props;

  return (
    // @ts-ignore
    <TextField
      {...textFiledProps}
      type="text"
      InputProps={{
        ...(textFiledProps.InputProps ?? {}),
        disableUnderline: true,
        inputComponent: TextFieldNumberComponent as any,
        inputProps: {
          decimalScale: numericProps.decimalScale,
          allowNegative: numericProps.allowNegative,
          maxLength: 79,
          thousandSeparator: numericProps.thousandSeparator,
          value: props.value,
        },
      }}
    />
  );
}
