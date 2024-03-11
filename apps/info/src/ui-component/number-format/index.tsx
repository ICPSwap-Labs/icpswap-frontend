import { forwardRef } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import { InputBaseComponentProps } from "@mui/material";

type Props = {
  [key: string]: any;
};

export default forwardRef<NumberFormat<HTMLInputElement>, NumberFormatProps<InputBaseComponentProps>>(
  (props: Props, ref) => {
    const { onChange, value, name, ...other } = props;

    return (
      <NumberFormat
        {...other}
        value={value}
        getInputRef={ref}
        onValueChange={(values) => {
          // fix outsize value change cause to maximum update
          if (values.value === props.value) return;

          if (onChange) {
            onChange({
              target: {
                name: name ?? "",
                value: values.value,
              },
            });
          }
        }}
      />
    );
  },
);
