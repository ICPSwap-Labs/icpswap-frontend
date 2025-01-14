import React, { useEffect, useState, useRef } from "react";
import { Typography, Box, Menu, Grid, MenuItem, useTheme, makeStyles, Theme } from "components/Mui";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { isDarkTheme } from "utils";
import { NoData } from "components/index";

const useStyles = (contained: boolean, fullHeight?: boolean) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: contained ? `15px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
        "& input": {
          color: theme.palette.text.primary,
        },
      },
    };
  });
};

export type Menus = {
  label: React.ReactNode;
  value: any;
};

export interface SelectProps {
  label?: string | React.ReactNode;
  value?: any;
  width?: number;
  onChange?: (value: any) => void;
  required?: boolean;
  menus: Menus[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  contained?: boolean;
  CustomNoData?: React.ReactNode;
  placeholder?: string;
  type?: string;
  menuDisabled?: (value: Menus) => boolean;
  helperText?: string;
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

export function Value({ value, menus = [], helperText }: { helperText?: string; value?: any; menus: Menus[] }) {
  return (
    <>
      <Typography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        color="#fff"
        component="div"
      >
        {menus.filter((menu) => menu.value === value)[0]?.label ?? value}
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

export function Select({
  value,
  onChange,
  menus = [],
  maxWidth,
  fullHeight,
  disabled,
  contained = true,
  width,
  CustomNoData,
  menuDisabled,
  helperText,
  ...props
}: SelectProps) {
  const classes = useStyles(contained, fullHeight)();
  const [anchorEl, setAnchorEl] = useState(null);
  const outerBoxRef = useRef<HTMLElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const theme = useTheme();

  const handleOuterBoxClick = (event: any) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
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

  const isDark = isDarkTheme(theme);

  return (
    <>
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
            ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
            cursor: "pointer",
            minWidth: "108px",
          }}
          container
          alignItems="center"
        >
          <>
            <Grid container alignItems="center">
              <Grid item xs sx={{ marginRight: "10px" }}>
                {value ? (
                  <Value menus={menus} value={value} helperText={helperText} />
                ) : (
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    color={isDark ? "#fff" : "#c5c5c5"}
                  >
                    {props.placeholder}
                  </Typography>
                )}
              </Grid>

              <KeyboardArrowDownIcon sx={{ width: "18px", height: "18px", cursor: "pointer", color: "#8492C4" }} />
            </Grid>
          </>
        </Grid>
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
              minWidth: "108px",
              transform: "translateY(10px)",
              maxHeight: "450px",
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
