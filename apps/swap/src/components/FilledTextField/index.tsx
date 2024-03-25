import React, { useEffect, useState, useRef } from "react";
import { TextField, Typography, Box, Menu, Grid, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NoData from "components/no-data";
import { Theme } from "@mui/material/styles";

const useStyles = (contained: boolean, fullHeight?: boolean) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        border: contained ? theme.palette.border.normal : "none",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: contained ? `9px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
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
  label?: string | React.ReactNode;
  value?: any;
  width?: number;
  select?: boolean;
  onChange?: (value: any) => void;
  required?: boolean;
  menus?: FilledTextFiledMenus[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  InputProps?: any;
  contained?: boolean;
  alignCenter?: boolean;
  CustomNoData?: React.ReactNode;
  placeholder?: string;
  type?: string;
  menuDisabled?: (value: FilledTextFiledMenus) => boolean;
  helperText?: string;
  multiline?: boolean;
  [x: string]: any;
}

export function Label({ label, required }: { label?: React.ReactNode; required?: boolean }) {
  return (
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
  );
}

export interface ValueProps {
  helperText?: string;
  select?: boolean;
  value?: any;
  menus?: FilledTextFiledMenus[];
}

export function Value({ select, value, menus = [], helperText }: ValueProps) {
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

export default function FilledTextField({
  label,
  value,
  select,
  onChange,
  required,
  menus = [],
  maxWidth,
  fullHeight,
  disabled,
  InputProps,
  contained = true,
  alignCenter = false,
  width,
  CustomNoData,
  menuDisabled,
  helperText,
  multiline,
  ...props
}: FilledTextFieldProps) {
  const classes = useStyles(contained, fullHeight)();
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
    <>
      {alignCenter ? (
        <Box
          ref={outerBoxRef}
          sx={{
            ...(width ? { width: `${width}px` } : {}),
            ...(fullHeight ? { height: "100%" } : {}),
          }}
          onClick={handleOuterBoxClick}
        >
          <Grid
            className={classes.inputBox}
            sx={{
              ...(fullHeight ? { height: "100%" } : {}),
              ...(select ? { cursor: "pointer" } : {}),
              ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
            }}
            container
            alignItems="center"
          >
            <>
              {contained && <Label required={required} label={label} />}
              <Grid container alignItems="center">
                <Grid item xs>
                  {!select ? (
                    <TextField
                      sx={{
                        fontSize: "14px",
                      }}
                      inputRef={inputRef}
                      {...props}
                      variant="standard"
                      onChange={({ target: { value } }) => onChange && onChange(value)}
                      value={value}
                      InputProps={{
                        disableUnderline: true,
                        ...(InputProps || {}),
                      }}
                      fullWidth
                      multiline={multiline}
                      disabled={disabled}
                      helperText={helperText}
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
                </Grid>
                {select && <KeyboardArrowDownIcon sx={{ cursor: "pointer" }} />}
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
            ...(select ? { cursor: "pointer" } : {}),
            ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
          }}
          onClick={handleOuterBoxClick}
        >
          <>
            {contained && <Label required={required} label={label} />}
            <Grid container alignItems="center">
              <Grid item xs>
                {!select ? (
                  <TextField
                    sx={{
                      fontSize: "14px",
                    }}
                    inputRef={inputRef}
                    {...props}
                    variant="standard"
                    onChange={({ target: { value } }) => onChange && onChange(value)}
                    value={value}
                    multiline={multiline}
                    InputProps={{
                      disableUnderline: true,
                      ...(InputProps || {}),
                    }}
                    fullWidth
                    disabled={disabled}
                    helperText={helperText}
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
              </Grid>
              {select && <KeyboardArrowDownIcon sx={{ cursor: "pointer" }} />}
            </Grid>
          </>
        </Box>
      )}

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
    </>
  );
}
