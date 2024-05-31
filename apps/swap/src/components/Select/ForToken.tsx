import React, { useEffect, useState, useRef, ReactNode, useMemo } from "react";
import { Typography, Box, Checkbox, Popper, TextField, InputAdornment } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";
import { NoData } from "components/index";
import { ClickAwayListener } from "@mui/base";
import { Search } from "react-feather";

interface StyleProps {
  contained: boolean;
  fullHeight?: boolean;
  filled?: boolean;
  padding?: string;
}

const useStyles = ({ contained, fullHeight, filled, padding }: StyleProps) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        display: "flex",
        alignItems: "center",
        background: filled ? theme.palette.background.level4 : theme.palette.background.level1,
        borderRadius: filled ? "8px" : "12px",
        padding: padding !== undefined ? padding : contained ? `9px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
        width: "100%",
        "& input": {
          color: theme.palette.text.primary,
        },
        "&.none-background": {
          background: "transparent",
        },
      },
    };
  });
};

export type MenuProps = {
  label: ReactNode;
  value: any;
  selectLabel?: ReactNode;
  additional?: string;
};

export type CustomLabelProps = {
  menu: MenuProps;
};

export interface SelectProps {
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  required?: boolean;
  menus?: MenuProps[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  contained?: boolean;
  CustomNoData?: React.ReactNode;
  placeholder?: string;
  multiple?: boolean;
  menuMaxHeight?: string;
  search?: boolean;
  onSearch?: (search: string | undefined) => void;
  customLabel?: boolean;
  border?: boolean;
  menuFilter?: (menu: MenuProps) => boolean;
  filled?: boolean;
  showClean?: boolean;
  showBackground?: boolean;
  minMenuWidth?: string;
  valueColor?: string;
  padding?: string;
}

export function Select({
  label,
  value,
  onChange,
  required,
  menus = [],
  maxWidth,
  fullHeight,
  disabled,
  contained = true,
  CustomNoData,
  multiple = false,
  menuMaxHeight,
  onSearch,
  search: hasSearch,
  customLabel,
  menuFilter,
  filled,
  showClean = true,
  showBackground = true,
  minMenuWidth = "120px",
  valueColor,
  padding,
  ...props
}: SelectProps) {
  const classes = useStyles({ contained, fullHeight, filled, padding })();
  const [anchorEl, setAnchorEl] = useState(null);
  const outerBoxRef = useRef<HTMLElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const theme = useTheme() as Theme;

  const [search, setSearch] = useState<undefined | string>(undefined);
  const [showClose, setShowClose] = useState<boolean>(false);

  const handleOuterBoxClick = (event: any) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch(undefined);
    if (onSearch) onSearch(undefined);
  };

  useEffect(() => {
    const width = outerBoxRef?.current?.clientWidth;
    setMenuWidth(width ?? undefined);
  }, []);

  const handleMenuItemClick = (menu: MenuProps) => {
    if (!multiple) {
      setSearch(undefined);
      if (onSearch) onSearch(undefined);
      setAnchorEl(null);
      if (onChange) onChange(menu.value);
    } else {
      const oldSelected = value ? [...value] : [];

      if (value?.includes(menu.value)) {
        const index = oldSelected.findIndex((item) => item === menu.value);

        if (index !== -1) {
          oldSelected.splice(index, 1);
          if (onChange) onChange(oldSelected);
        }
      } else {
        const newSelected = [...oldSelected, menu.value];
        if (onChange) onChange(newSelected);
      }
    }
  };

  const handleCheckboxChange = (checked: boolean, selectedValue: any) => {
    if (onChange) {
      const oldSelected = value ? [...value] : [];

      if (checked) {
        const newSelected = [...oldSelected, selectedValue];
        onChange(newSelected);
      } else {
        const index = oldSelected.findIndex((item) => item === selectedValue);

        if (index !== -1) {
          oldSelected.splice(index, 1);
          onChange(oldSelected);
        }
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  const selectedMenu = useMemo(() => {
    return menus.filter((menu) => menu.value === value)[0];
  }, [menus, value]);

  const handleMouseEnter = () => {
    if (showClean === false) return;
    setShowClose(true);
  };

  const handleMouseLeave = () => {
    setShowClose(false);
  };

  const handleEmptyValue = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    if (onChange) onChange(undefined);
  };

  return (
    <>
      <Box
        ref={outerBoxRef}
        className={`${classes.inputBox}${showBackground ? "" : " none-background"}`}
        sx={{
          ...(fullHeight ? { height: "100%" } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
          cursor: "pointer",
        }}
        onClick={handleOuterBoxClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {contained && label && (
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

        <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            {value ? (
              <Typography color={valueColor ?? "text.primary"} component="div">
                {selectedMenu?.selectLabel ?? selectedMenu?.label}
              </Typography>
            ) : (
              <Typography color="#4f5a7f">{props.placeholder}</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {showClose && !!value ? (
              <CloseIcon sx={{ cursor: "pointer" }} onClick={handleEmptyValue} />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ transition: "all 300ms", rotate: anchorEl ? "180deg" : "0deg", cursor: "pointer" }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Popper
        id="Select-token-popper"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        style={{
          width: menuWidth,
          background: theme.colors.darkLevel3,
          border: "1px solid #49588E",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: minMenuWidth,
          zIndex: 100000,
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            {hasSearch ? (
              <Box
                sx={{
                  margin: "8px 0",
                  padding: "0 6px",
                  "& input": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <TextField
                  sx={{
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    background: theme.palette.background.level1,
                  }}
                  placeholder="Search"
                  variant="standard"
                  onChange={({ target: { value } }) => handleSearchChange(value)}
                  value={search}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size="12px" color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Box>
            ) : null}

            <Box sx={{ maxHeight: menuMaxHeight ?? "540px", overflow: "hidden auto" }}>
              {menus.map((menu, index) => {
                const isFiltered = menuFilter && menuFilter(menu);

                return customLabel ? (
                  <Box
                    key={menu.value + index}
                    onClick={() => handleMenuItemClick(menu)}
                    sx={{ ...(isFiltered ? { display: "none" } : {}) }}
                  >
                    {menu.label}
                  </Box>
                ) : (
                  <Box
                    key={menu.value + index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "48px",
                      padding: "0 16px",
                      cursor: "pointer",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      ...(isFiltered ? { display: "none" } : {}),
                      "&:hover": {
                        background: "#313D67",
                        color: "text.primary",
                      },
                    }}
                    onClick={() => handleMenuItemClick(menu)}
                  >
                    {multiple && (
                      <Box sx={{ margin: "0 5px 0 0" }}>
                        <Checkbox
                          sx={{ padding: 0 }}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                            handleCheckboxChange(checked, menu.value)
                          }
                          checked={value?.includes(menu.value)}
                        />
                      </Box>
                    )}

                    {menu.label}
                  </Box>
                );
              })}

              {menus.length === 0 ? CustomNoData || <NoData /> : null}
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
