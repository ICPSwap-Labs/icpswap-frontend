import { Override } from "@icpswap/types";
import FilledTextField, { FilledTextFieldProps } from "components/Input/FilledTextField";
import { TextFieldNumberComponent, NumericProps } from "components/Input/NumberTextField";

export type NumberFilledTextFieldProps = Override<FilledTextFieldProps, { numericProps: NumericProps }>;

export function NumberFilledTextField(props: NumberFilledTextFieldProps) {
  const { numericProps, ...textFieldProps } = props;

  return (
    <FilledTextField
      {...textFieldProps}
      value={props.value}
      textFiledProps={{
        slotProps: {
          input: {
            ...(textFieldProps.slotProps?.input ?? {}),
            inputComponent: TextFieldNumberComponent,
            inputProps: {
              decimalScale: numericProps.decimalScale,
              allowNegative: numericProps.allowNegative ?? false,
              maxLength: 79,
              thousandSeparator: numericProps.thousandSeparator ?? false,
              value: props.value,
            },
          },
        },
      }}
    />
  );
}
