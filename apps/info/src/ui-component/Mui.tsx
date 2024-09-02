import { Theme } from "@mui/material/styles";
import useMuiTheme from "@mui/styles/useTheme";

export { default as Box, type BoxProps } from "@mui/material/Box";
export { default as Typography, type TypographyProps } from "@mui/material/Typography";
export { default as Grid, type GridProps } from "@mui/material/Grid";
export { default as SvgIcon, type SvgIconProps } from "@mui/material/SvgIcon";
export { default as Button, type ButtonProps } from "@mui/material/Button";
export { default as TextField, type TextFieldProps } from "@mui/material/TextField";
export { default as Fade, type FadeProps } from "@mui/material/Fade";
export { default as Collapse, type CollapseProps } from "@mui/material/Collapse";
export { default as Checkbox, type CheckboxProps } from "@mui/material/Checkbox";
export { default as MenuList, type MenuListProps } from "@mui/material/MenuList";
export { default as MenuItem } from "@mui/material/MenuItem";
export { default as Popper } from "@mui/material/Popper";
export { default as useMediaQuery } from "@mui/material/useMediaQuery";
export { default as CircularProgress } from "@mui/material/CircularProgress";
export { default as InputAdornment } from "@mui/material/InputAdornment";
export { default as Avatar } from "@mui/material/Avatar";
export { default as Link } from "@mui/material/Link";
export { default as makeStyles } from "@mui/styles/makeStyles";
export { default as Tooltip } from "@mui/material/Tooltip";
export { default as Chip } from "@mui/material/Chip";
export { default as ButtonBase } from "@mui/material/ButtonBase";

export function useTheme() {
  return useMuiTheme() as Theme;
}

export type { Theme };
