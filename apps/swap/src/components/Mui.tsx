import createTheme from "@mui/material/styles/createTheme";
import useMuiTheme from "@mui/styles/useTheme";

export { keyframes } from "@emotion/react";
export { ClickAwayListener } from "@mui/base/ClickAwayListener";
export { type AvatarProps, default as Avatar } from "@mui/material/Avatar";
export { default as Backdrop } from "@mui/material/Backdrop";
export { type BoxProps, default as Box } from "@mui/material/Box";
export { default as Breadcrumbs } from "@mui/material/Breadcrumbs";
export { type ButtonProps, default as Button } from "@mui/material/Button";
export { default as ButtonBase } from "@mui/material/ButtonBase";
export { default as Card } from "@mui/material/Card";
export { type CheckboxProps, default as Checkbox } from "@mui/material/Checkbox";
export { default as Chip } from "@mui/material/Chip";
export { default as CircularProgress } from "@mui/material/CircularProgress";
export { type CollapseProps, default as Collapse } from "@mui/material/Collapse";
export { default as CssBaseline } from "@mui/material/CssBaseline";
export { default as Dialog } from "@mui/material/Dialog";
export { default as DialogContent } from "@mui/material/DialogContent";
export { default as DialogTitle } from "@mui/material/DialogTitle";
export { default as Drawer } from "@mui/material/Drawer";
export { default as Fade, type FadeProps } from "@mui/material/Fade";
export { default as Grid, type GridProps } from "@mui/material/Grid";
export { default as Input } from "@mui/material/Input";
export { default as InputAdornment } from "@mui/material/InputAdornment";
export { default as Link } from "@mui/material/Link";
export { default as Menu } from "@mui/material/Menu";
export { default as MenuItem } from "@mui/material/MenuItem";
export { default as MenuList, type MenuListProps } from "@mui/material/MenuList";
export { default as Paper } from "@mui/material/Paper";
export { default as Popper } from "@mui/material/Popper";
export { default as Slider, type SliderProps } from "@mui/material/Slider";
export { default as StyledEngineProvider } from "@mui/material/StyledEngineProvider";
export { default as SvgIcon, type SvgIconProps } from "@mui/material/SvgIcon";
export { default as Switch, type SwitchProps } from "@mui/material/Switch";
export { default as ThemeProvider } from "@mui/material/styles/ThemeProvider";
export { default as TextField, type TextFieldProps } from "@mui/material/TextField";
export { default as Tooltip, tooltipClasses } from "@mui/material/Tooltip";
export { default as Typography, type TypographyProps } from "@mui/material/Typography";
export { default as useMediaQuery } from "@mui/material/useMediaQuery";
export { default as makeStyles } from "@mui/styles/makeStyles";
export { default as styled } from "@mui/styles/styled";

interface Theme {
  direction: string;
  palette: any;
  typography: any;
  components: any;
  themeOption: any;
  colors: any;
  fontSize: any;
  customization: any;
  radius: number;
  breakpoints: any;
  spacing: (sp: number) => string;
  shadows: string[];
  transitions: any;
  textPrimary: string;
}

export function useTheme() {
  return useMuiTheme() as Theme;
}

export type { Theme };

export { createTheme };
