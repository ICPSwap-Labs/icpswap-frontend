import { useRef } from "react";
import { TextField, Typography, Box, Grid, TextFieldProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = (contained: boolean, fullHeight?: boolean) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level1,
        borderRadius: "8px",
        padding: contained ? `9px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
        width: "100%",
        "& input": {
          color: theme.palette.text.primary,
        },
      },
    };
  });
};

export type FilledTextFiledMenus = {
  label: string;
  value: any;
};

export interface FilledTextFieldProps {
  label?: string;
  value?: any;
  width?: string;
  onChange?: (value: any) => void;
  required?: boolean;
  menus?: FilledTextFiledMenus[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  InputProps?: any;
  contained?: boolean;
  alignCenter?: boolean;
  textFiledProps?: TextFieldProps;
}

export default function FilledTextField({
  label,
  value,
  onChange,
  required,
  maxWidth,
  fullHeight,
  disabled,
  contained = true,
  alignCenter = false,
  width,
  textFiledProps,
}: FilledTextFieldProps) {
  const classes = useStyles(contained, fullHeight)();
  const inputRef = useRef<HTMLElement | null>(null);
  const outerBoxRef = useRef<HTMLElement | null>(null);

  const handleOuterBoxClick = () => {
    if (disabled) return;
    inputRef?.current?.focus();
  };

  return (
    <>
      {alignCenter ? (
        <Box
          ref={outerBoxRef}
          sx={{
            ...(width ? { width } : {}),
            ...(fullHeight ? { height: "100%" } : {}),
          }}
          onClick={handleOuterBoxClick}
        >
          <Grid
            className={classes.inputBox}
            sx={{
              ...(fullHeight ? { height: "100%" } : {}),
              ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
            }}
            container
            alignItems="center"
          >
            <>
              {contained && (
                <Box>
                  {required && (
                    <Typography sx={{ color: "#D3625B" }} fontSize={12} component="span">
                      *
                    </Typography>
                  )}
                  <Typography component="span" fontSize={12}>
                    {label}
                  </Typography>
                </Box>
              )}
              <Grid container alignItems="center">
                <Grid item xs>
                  <TextField
                    sx={{
                      fontSize: "14px",
                      "& input": {
                        padding: "0",
                      },
                    }}
                    inputRef={inputRef}
                    {...(textFiledProps
                      ? {
                          ...textFiledProps,
                          InputProps: { disableUnderline: true, ...(textFiledProps?.InputProps ?? {}) },
                        }
                      : { InputProps: { disableUnderline: true } })}
                    variant="standard"
                    onChange={({ target: { value } }) => onChange && onChange(value)}
                    value={value ?? ""}
                    fullWidth
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </>
          </Grid>
        </Box>
      ) : (
        <Box
          ref={outerBoxRef}
          className={classes.inputBox}
          sx={{
            ...(fullHeight ? { height: "100%" } : {}),
            ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
          }}
          onClick={handleOuterBoxClick}
        >
          <>
            {contained && (
              <Box>
                {required && (
                  <Typography sx={{ color: "#D3625B" }} fontSize={12} component="span">
                    *
                  </Typography>
                )}
                <Typography component="span" fontSize={12}>
                  {label}
                </Typography>
              </Box>
            )}
            <Grid container alignItems="center">
              <Grid item xs>
                <TextField
                  sx={{
                    fontSize: "14px",
                  }}
                  {...(textFiledProps
                    ? {
                        ...textFiledProps,
                        InputProps: { disableUnderline: true, ...(textFiledProps?.InputProps ?? {}) },
                      }
                    : { InputProps: { disableUnderline: true } })}
                  inputRef={inputRef}
                  variant="standard"
                  onChange={({ target: { value } }) => onChange && onChange(value)}
                  value={value}
                  fullWidth
                  disabled={disabled}
                />
              </Grid>
            </Grid>
          </>
        </Box>
      )}
    </>
  );
}
