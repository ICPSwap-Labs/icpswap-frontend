import { TextField, Box, TextFieldProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

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

export default function CustomTextField(props: TextFieldProps) {
  const classes = useStyles();

  return (
    <Box className={classes.inputBox}>
      {/* @ts-ignore */}
      <TextField
        {...props}
        variant={props.variant ?? "standard"}
        InputProps={{
          disableUnderline: true,
          ...(props?.InputProps ?? {}),
        }}
      />
    </Box>
  );
}
