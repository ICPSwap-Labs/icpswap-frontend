import { TextField, Box, TextFieldProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import type { Override } from "@icpswap/types";

const useStyles = makeStyles((theme: Theme) => {
  return {
    inputBox: {
      background: theme.palette.background.level4,
      borderRadius: "8px",
      padding: "9px 16px",
      "& input": {
        color: theme.textPrimary,
      },
    },
  };
});

export type CustomTextFieldProps = Override<TextFieldProps, { placeholderSize?: string }>;

export default function CustomTextField(props: CustomTextFieldProps) {
  const classes = useStyles();

  return (
    <Box className={classes.inputBox}>
      {/* @ts-ignore */}
      <TextField
        {...props}
        sx={{
          "& input::placeholder": {
            fontSize: props.placeholderSize ?? "14px",
          },
          "& textarea::placeholder": {
            fontSize: props.placeholderSize ?? "14px",
          },
          ...props.sx,
        }}
        variant={props.variant ?? "standard"}
        InputProps={{
          disableUnderline: true,
          ...(props?.InputProps ?? {}),
        }}
      />
    </Box>
  );
}
