import { useEffect, useState, useRef, useMemo, ReactNode, memo } from "react";

import { Box } from "../Mui";
import { SelectPanel } from "./Panel";
import { DropDownMenu } from "./DropDownMenu";
import { MenuProps } from "./types";

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
  menuFilter?: (menu: MenuProps, search: string | undefined) => boolean;
  filled?: boolean;
  showClean?: boolean;
  showBackground?: boolean;
  minMenuWidth?: string;
  valueColor?: string;
  panelPadding?: string;
  panel?: (menu: MenuProps | null | undefined) => ReactNode;
}

const __Select = ({
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
  placeholder,
  panelPadding,
  panel,
}: SelectProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const wrapperRef = useRef<HTMLElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const width = wrapperRef?.current?.clientWidth;
    setMenuWidth(width ?? undefined);
  }, [wrapperRef]);

  const handleOuterBoxClick = (event: any) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedMenu = useMemo(() => {
    return menus.filter((menu) => menu.value === value)[0];
  }, [menus, value]);

  return (
    <>
      <Box ref={wrapperRef} sx={{ height: fullHeight ? "100%" : "auto" }}>
        <SelectPanel
          filled={filled}
          showBackground={showBackground}
          showClean={showClean}
          onChange={onChange}
          menu={selectedMenu}
          onClick={handleOuterBoxClick}
          open={!!anchorEl}
          valueColor={valueColor}
          padding={panelPadding}
          required={required}
          label={label}
          maxWidth={maxWidth}
          fullHeight={fullHeight}
          contained={contained}
          value={value}
          placeholder={placeholder}
          panel={panel}
        />
      </Box>

      <DropDownMenu
        menus={menus}
        menuWidth={menuWidth}
        anchor={anchorEl}
        value={value}
        onChange={onChange}
        onClose={handleClose}
        onMenuClick={handleClose}
        search={hasSearch}
        onSearch={onSearch}
        menuFilter={menuFilter}
        CustomNoData={CustomNoData}
        multiple={multiple}
        minMenuWidth={minMenuWidth}
        menuMaxHeight={menuMaxHeight}
        customLabel={customLabel}
      />
    </>
  );
};

export const Select = memo(__Select);
