import React, { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import { Search } from "react-feather";

import { MenuProps } from "./types";
import { Theme, useTheme, Box, Checkbox, Popper, TextField, InputAdornment } from "../Mui";
import { NoData } from "../NoData";

export interface DropDownMenuProps {
  value?: any;
  onChange?: (value: any) => void;
  required?: boolean;
  menus: MenuProps[];
  CustomNoData?: React.ReactNode;
  multiple?: boolean;
  menuMaxHeight?: string;
  search?: boolean;
  onSearch?: (search: string | undefined) => void;
  customLabel?: boolean;
  menuFilter?: (menu: MenuProps) => boolean;
  minMenuWidth?: string;
  anchor: any | undefined;
  onClose: () => void;
  onMenuClick: () => void;
  menuWidth?: number;
}

export function DropDownMenu({
  value,
  onChange,
  menus,
  CustomNoData,
  multiple = false,
  menuMaxHeight,
  onSearch,
  search: hasSearch,
  customLabel,
  menuFilter,
  minMenuWidth = "120px",
  onClose,
  menuWidth,
  onMenuClick,
  anchor,
}: DropDownMenuProps) {
  const theme = useTheme() as Theme;
  const [search, setSearch] = useState<undefined | string>(undefined);

  const handleClose = () => {
    setSearch(undefined);
    onClose();
    if (onSearch) onSearch(undefined);
  };

  const handleMenuItemClick = (menu: MenuProps) => {
    if (!multiple) {
      setSearch(undefined);
      onMenuClick();
      if (onSearch) onSearch(undefined);
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

  return (
    <Popper
      id="drop-down-menus"
      open={Boolean(anchor)}
      anchorEl={anchor}
      style={{
        width: menuWidth ?? "fit-content",
        minWidth: minMenuWidth ?? "fit-content",
        background: theme.colors.darkLevel3,
        border: "1px solid #49588E",
        borderRadius: "12px",
        overflow: "hidden",
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
                slotProps={{
                  input: {
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size="12px" color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  },
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
  );
}
