import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { TextField, Typography, Box, Menu, MenuItem, makeStyles, Theme, TextFieldProps } from "components/Mui";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Flex, NoData } from "@icpswap/ui";

interface UseStylesProps {
  contained: boolean;
  fullHeight?: boolean;
  borderRadius: string;
  label: boolean;
  border?: string | boolean;
  multiline?: boolean;
  background?: string | "level3";
  inputPadding?: string;
}

const useStyles = ({
  inputPadding,
  contained,
  background,
  fullHeight,
  multiline,
  borderRadius,
  label,
  border,
}: UseStylesProps) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        display: label && contained ? "block" : "flex",
        alignItems: "center",
        border: contained
          ? border ?? theme.palette.border.normal
          : border === true
          ? theme.palette.border.normal
          : border === "border0"
          ? theme.palette.border.border0
          : "none",
        background: background
          ? background === "level3"
            ? theme.palette.background.level3
            : background
          : theme.palette.background.level4,
        borderRadius,
        padding: inputPadding ?? (contained ? `7px 12px` : "3px 12px"),
        gap: "0 5px",
        height: contained || multiline ? "auto" : fullHeight ? "100%" : "48px",
        ...(multiline ? { minHeight: "48px" } : {}),
        margin: label ? "12px 0 0 0" : "0",
        "@media(max-width: 640px)": {
          padding: inputPadding ?? contained ? `4px 6px` : "0 6px",
        },
        "& input": {
          color: theme.palette.text.primary,
        },
        "&:hover": {
          borderColor: "#ffffff",
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
  label?: string | React.ReactNode;
  value?: any;
  select?: boolean;
  onChange?: (value: any) => void;
  onFocus?: () => void;
  required?: boolean;
  menus?: FilledTextFiledMenus[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  InputProps?: any;
  contained?: boolean;
  CustomNoData?: React.ReactNode;
  placeholder?: string;
  type?: string;
  menuDisabled?: (value: FilledTextFiledMenus) => boolean;
  helperText?: string;
  multiline?: boolean;
  borderRadius?: string;
  border?: string | boolean;
  labelSize?: string;
  fontSize?: string;
  placeholderSize?: string;
  background?: string;
  inputPadding?: string;
  textFiledProps?: TextFieldProps;
  [x: string]: any;
}

export interface FilledTextFieldLabelProps {
  label?: React.ReactNode;
  required?: boolean;
  labelSize?: string;
}

export function FilledTextFieldLabel({ label, required, labelSize = "16px" }: FilledTextFieldLabelProps) {
  return (
    <Box>
      {required && (
        <Typography sx={{ color: "#D3625B" }} fontSize={labelSize} component="span">
          *
        </Typography>
      )}

      <Typography component="span" fontSize={labelSize}>
        {label}
      </Typography>
    </Box>
  );
}

interface ValueProps {
  helperText?: string;
  select?: boolean;
  value?: any;
  menus?: FilledTextFiledMenus[];
}

function Value({ select, value, menus = [], helperText }: ValueProps) {
  return (
    <>
      <Typography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        color="textPrimary"
      >
        {select ? menus.filter((menu) => menu.value === value)[0]?.label ?? value : value}
      </Typography>
      {helperText ? (
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: "4px",
          }}
        >
          {helperText}
        </Typography>
      ) : null}
    </>
  );
}

function FilledTextField(
  {
    label,
    value,
    select,
    onChange,
    required,
    menus = [],
    maxWidth,
    fullHeight,
    disabled,
    borderRadius = "8px",
    contained = false,
    CustomNoData,
    menuDisabled,
    helperText,
    multiline,
    onFocus,
    border,
    background,
    labelSize,
    inputPadding,
    textFiledProps,
    ...props
  }: FilledTextFieldProps,
  ref,
) {
  const classes = useStyles({
    inputPadding,
    contained,
    background,
    fullHeight,
    borderRadius,
    border,
    label: !!label,
    multiline,
  })();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef<HTMLElement | null>(null);
  const outerBoxRef = useRef<HTMLElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const handleOuterBoxClick = (event: any) => {
    if (disabled) return;
    if (select) {
      setAnchorEl(event.currentTarget);
    } else {
      inputRef?.current?.focus();
    }
  };

  const focus = () => {
    inputRef?.current?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      focus,
    }),
    [focus],
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const width = outerBoxRef?.current?.clientWidth;
    setMenuWidth(width ?? undefined);
  }, []);

  const handleMenuItemClick = ({ value }: { value: any }) => {
    if (onChange) onChange(value);
    setAnchorEl(null);
  };

  return (
    <Box>
      {label ? <FilledTextFieldLabel required={required} label={label} labelSize={labelSize} /> : null}
      <Box
        ref={outerBoxRef}
        className={classes.inputBox}
        sx={{
          ...(fullHeight ? { height: "100%" } : {}),
          ...(select ? { cursor: "pointer" } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
        }}
        onClick={handleOuterBoxClick}
      >
        <>
          {contained && <FilledTextFieldLabel required={required} label={label} labelSize={labelSize} />}
          <Flex fullWidth sx={{ flex: 1 }} justify="space-between">
            {!select ? (
              <TextField
                sx={{
                  "& input": {
                    lineHeight: "1.15rem",
                    fontSize: props.fontSize ?? "16px",
                  },
                  "& textarea": {
                    lineHeight: "1.15rem",
                    fontSize: props.fontSize ?? "16px",
                  },
                  "& input::placeholder": {
                    fontSize: props.placeholderSize ?? "16px",
                  },
                  "& textarea::placeholder": {
                    fontSize: props.placeholderSize ?? "16px",
                  },
                  ...textFiledProps?.sx,
                }}
                {...(textFiledProps
                  ? {
                      ...textFiledProps,
                      InputProps: { disableUnderline: true, ...(textFiledProps?.InputProps ?? {}) },
                    }
                  : { InputProps: { disableUnderline: true } })}
                inputRef={inputRef}
                {...props}
                variant="standard"
                onChange={({ target: { value } }) => onChange && onChange(value)}
                value={value}
                multiline={multiline}
                fullWidth
                disabled={disabled}
                helperText={helperText}
                onFocus={onFocus}
                autoComplete="off"
                spellCheck={false}
              />
            ) : value ? (
              <Value menus={menus} value={value} helperText={helperText} select={select} />
            ) : (
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                color="#c5c5c5"
              >
                {props.placeholder}
              </Typography>
            )}
            {select && <KeyboardArrowDownIcon sx={{ cursor: "pointer" }} />}
          </Flex>
        </>
      </Box>

      {Boolean(anchorEl) && (
        <Menu
          className="custom-select"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          PaperProps={{
            style: {
              width: menuWidth,
              transform: "translateY(10px)",
            },
          }}
        >
          {menus.map((menu, index) => (
            <MenuItem
              key={menu.value + index}
              className={`${!!menuDisabled && menuDisabled(menu) ? "disabled" : ""}`}
              onClick={() => {
                if (!!menuDisabled && menuDisabled(menu)) return;
                handleMenuItemClick(menu);
              }}
            >
              {menu.label}
            </MenuItem>
          ))}
          {menus.length === 0 ? CustomNoData || <NoData /> : null}
        </Menu>
      )}
    </Box>
  );
}

export default forwardRef(FilledTextField);
