import React, { useEffect, useState, useRef, ReactNode, useMemo } from "react";
import { Typography, Box, Checkbox, Popper, InputAdornment } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";
import { ClickAwayListener } from "@mui/base";
import { NoData } from "../NoData";
import { FilledTextField } from "../Input";
import { SearchIcon } from "../../assets/icons/Search";

const useStyles = (contained: boolean, fullHeight?: boolean) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level1,
        borderRadius: "12px",
        padding: contained ? `9px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
        width: "100%",
        "& input": {
          color: theme.palette.text.primary,
        },
      },
    };
  });
};

export type SelectMenuItemProps = {
  label: ReactNode;
  value: any;
  selectLabel?: ReactNode;
};

export type CustomLabelProps = {
  menu: SelectMenuItemProps;
};

export interface SelectProps {
  label?: string;
  value?: any;
  width?: number | string;
  onChange?: (value: any) => void;
  required?: boolean;
  menus?: SelectMenuItemProps[];
  maxWidth?: number;
  fullHeight?: boolean;
  disabled?: boolean;
  InputProps?: any;
  contained?: boolean;
  CustomNoData?: React.ReactNode;
  placeholder?: string;
  multiple?: boolean;
  menuMaxHeight?: string;
  search?: boolean;
  onSearch?: (search: string | undefined) => void;
  customLabel?: boolean;
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
  InputProps,
  contained = true,
  width,
  CustomNoData,
  multiple = false,
  menuMaxHeight,
  onSearch,
  search: hasSearch,
  customLabel,
  ...props
}: SelectProps) {
  const classes = useStyles(contained, fullHeight)();
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

  const handleMenuItemClick = (menu: SelectMenuItemProps) => {
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
        className={classes.inputBox}
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

        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {value ? (
              <Typography color="textPrimary" component="div">
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
                sx={{
                  transition: "all 300ms",
                  rotate: anchorEl ? "180deg" : "0deg",
                  cursor: "pointer",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {anchorEl ? (
        <Popper
          id="Select-popper"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          style={{
            width: menuWidth,
            background: theme.colors.darkLevel3,
            border: "1px solid #49588E",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            {/* @ts-ignore */}
            <Box>
              {hasSearch ? (
                <Box sx={{ margin: "8px 0", padding: "0 12px", height: "40px" }}>
                  <FilledTextField
                    value={search}
                    fullHeight
                    textFiledProps={{
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                      placeholder: "Search",
                    }}
                    onChange={handleSearchChange}
                  />
                </Box>
              ) : null}

              <Box
                sx={{
                  maxHeight: menuMaxHeight ?? "540px",
                  overflow: "hidden auto",
                }}
              >
                {menus.map((menu, index) => {
                  return customLabel ? (
                    <Box key={`${menu.value}_${index}`} onClick={() => handleMenuItemClick(menu)}>
                      {menu.label}
                    </Box>
                  ) : (
                    <Box
                      key={`${menu.value}_${index}`}
                      sx={{
                        padding: "10px 10px",
                        cursor: "pointer",
                        "&:hover": {
                          background: "#313D67",
                        },
                      }}
                      onClick={() => handleMenuItemClick(menu)}
                    >
                      {multiple ? (
                        <Box sx={{ margin: "0 5px 0 0" }}>
                          <Checkbox
                            sx={{ padding: 0 }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                              handleCheckboxChange(checked, menu.value)
                            }
                            checked={value?.includes(menu.value)}
                          />
                        </Box>
                      ) : null}
                      {menu.label}
                    </Box>
                  );
                })}

                {menus.length === 0 ? CustomNoData || <NoData /> : null}
              </Box>
            </Box>
          </ClickAwayListener>
        </Popper>
      ) : null}
    </>
  );
}
