import { createTheme } from "components/Mui";
import colors from "theme/colors";
import { componentStyleOverrides } from "theme/compStyleOverride";
import { themePalette } from "theme/palette";
import { themeTypography } from "theme/typography";

const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.25rem",
};

const Radius = 12;

export interface ThemeOption {
  [key: string]: any;
}

export function theme(customization: { [key: string]: any }) {
  const themeOption: ThemeOption = {
    colors,
    fontSize,
    heading: "",
    paper: "",
    backgroundDefault: "",
    background: "",
    textPrimary: "",
    darkTextSecondary: "",
    textDark: "",
    textLight: "",
    menuSelected: "",
    menuSelectedBack: "",
    divider: "",
    customization,
    defaultGradient: `linear-gradient(89.44deg, ${colors.defaultGradientStart} -0.31%, ${colors.defaultGradientEnd} 91.14%)`,
    borderRadius: 12,
  };

  switch (customization.mode) {
    case "dark":
      themeOption.paper = colors.darkLevel2;
      themeOption.backgroundDefault = colors.darkPaper;
      themeOption.background = colors.darkBackground;
      themeOption.textPrimary = colors.darkTextPrimary;
      themeOption.textSecondary = colors.darkTextSecondary;
      themeOption.textTertiary = colors.darkTextTertiary;
      themeOption.textDark = colors.darkTextPrimary;
      themeOption.textLight = colors.lightTextPrimary;
      themeOption.menuBackground = colors.darkLevel1;
      themeOption.menuSelected = colors.darkSecondaryMain;
      themeOption.menuSelectedBack = colors.darkSecondaryMain + 15;
      themeOption.menuSelected = colors.paper;
      themeOption.divider = colors.darkTextPrimary;
      themeOption.heading = colors.darkTextSecondary;
      break;
    default:
      themeOption.paper = colors.paper;
      themeOption.backgroundDefault = colors.paper;
      themeOption.background = colors.primaryLight;
      themeOption.textPrimary = colors.lightTextPrimary;
      themeOption.textSecondary = colors.lightTextSecondary;
      themeOption.textTertiary = colors.lightTextTertiary;
      themeOption.textDark = colors.grey900;
      themeOption.menuBackground = colors.paper;
      themeOption.menuSelected = colors.lightTextPrimary;
      themeOption.menuSelectedBack = colors.secondaryLight;
      themeOption.menuSelected = colors.paper;
      themeOption.divider = colors.grey200;
      themeOption.heading = colors.grey900;
      break;
  }

  return createTheme({
    direction: customization.rtlLayout ? "rtl" : "ltr",
    palette: themePalette(themeOption),
    typography: themeTypography(themeOption),
    // @ts-expect-error
    components: componentStyleOverrides(themeOption),
    themeOption,
    colors,
    fontSize,
    customization,
    radius: Radius,
  });
}
