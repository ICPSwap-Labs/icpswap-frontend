import { isDarkTheme } from "utils";

export function themePalette(theme: { [key: string]: any }) {
  const isDark = isDarkTheme(theme);

  return {
    mode: theme.customization.mode,
    common: {
      black: theme.colors.darkPaper,
    },
    primary: {
      light: isDark ? theme.colors.darkPrimaryLight : theme.colors.primaryLight,
      main: isDark ? theme.colors.darkPrimaryMain : theme.colors.lightPrimaryMain,
      dark: isDark ? theme.colors.darkPrimaryDark : theme.colors.primaryDark,
      200: isDark ? theme.colors.darkPrimary200 : theme.colors.primary200,
      800: isDark ? theme.colors.darkPrimary800 : theme.colors.primary800,
      400: isDark ? theme.colors.dark400 : theme.colors.primary800,
    },
    secondary: {
      light: isDark ? theme.colors.darkSecondaryLight : theme.colors.secondaryLight,
      main: isDark ? theme.colors.darkSecondaryMain : "#617b66",
      dark: isDark ? theme.colors.darkSecondaryDark : "#4b6250",
      200: isDark ? theme.colors.darkSecondary200 : theme.colors.secondary200,
      800: isDark ? theme.colors.darkSecondary800 : theme.colors.secondary800,
    },
    info: {
      main: isDark ? "#9bbec7" : "#597f8b",
    },
    error: {
      light: theme.colors.errorLight,
      main: isDark ? theme.colors.errorMain : "#b2493a",
    },
    orange: {
      light: theme.colors.orangeLight,
      main: theme.colors.orangeMain,
      dark: theme.colors.orangeDark,
    },
    warning: {
      light: theme.colors.warningLight,
      main: isDark ? "#ddb46d" : "#966b27",
      dark: theme.colors.warningDark,
    },
    success: {
      light: theme.colors.successLight,
      main: isDark ? theme.colors.successDark : "#3f7c59",
      dark: theme.colors.successDark,
    },
    grey: {
      50: theme.colors.grey50,
      100: theme.colors.grey100,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.colors.darkTextPrimary,
      900: theme.textDark,
    },
    dark: {
      light: theme.colors.darkTextPrimary,
      main: theme.colors.darkLevel1,
      dark: theme.colors.darkLevel2,
      level3: theme.colors.darkLevel3,
      level4: theme.colors.darkLevel4,
    },
    text: {
      // MUI's alpha()/emphasize() helpers require literal colors for these
      // standard slots. Keep them aligned with the daisyUI themes in styles.css.
      primary: theme.textPrimary,
      secondary: theme.textSecondary,
      tertiary: "color-mix(in srgb, var(--color-base-content) 50%, transparent)",
      dark: "var(--color-base-content)",
      light: theme.textLight,
      danger: "var(--color-error)",
      orangeWarning: "var(--color-warning)",
      level1: isDark ? theme.colors.darkLevel1 : theme.colors.primaryLight,
      400: isDark ? theme.colors.dark400 : theme.colors.primary800,
      theme_primary: "var(--color-primary)",
      theme_secondary: "var(--color-secondary)",
      "theme-primary": "var(--color-primary)",
      "theme-secondary": "var(--color-secondary)",
      apr: "var(--color-success)",
      success: "var(--color-success)",
      default: "var(--color-neutral-content)",
      tooltip: theme.colors.darkLevel1,
    },
    textSize: {
      tooltip: "12px",
    },
    background: {
      paper: theme.paper,
      default: isDark ? theme.colors.darkPaper : "#f1ede3",
      level1: "var(--color-base-200)",
      level2: "var(--color-base-100)",
      level3: "color-mix(in srgb, var(--color-base-100) 65%, var(--color-base-300))",
      level4: "var(--color-base-200)",
      level5: "var(--color-base-300)",
      success: "var(--color-success)",
      wallet: "var(--color-base-100)",
    },
    border: {
      normal: "1px solid var(--color-base-300)",
      border0: "1px solid var(--color-neutral)",
      gray200: "1px solid var(--color-base-300)",
      1: "var(--color-base-300)",
      2: "var(--color-base-300)",
      3: "var(--color-neutral)",
      border4: "var(--color-base-300)",
      level1: "var(--color-base-200)",
      level2: "var(--color-base-100)",
      level3: "var(--color-base-300)",
      level4: "var(--color-neutral)",
    },
    avatar: {
      gray200BgColor: isDark ? { bgcolor: "#343c36" } : { bgcolor: "transparent" },
    },
    loading: {
      background: "var(--color-base-300)",
    },
  };
}
