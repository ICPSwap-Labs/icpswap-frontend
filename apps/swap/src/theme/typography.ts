export function themeTypography(theme: { [key: string]: any }) {
  return {
    fontFamily: theme.customization.fontFamily,
    h6: {
      fontWeight: 500,
      color: theme.textSecondary,
      fontSize: "0.75rem",
    },
    h5: {
      fontSize: "0.875rem",
      color: theme.textSecondary,
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      color: theme.textSecondary,
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      color: theme.textSecondary,
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      color: theme.textSecondary,
      fontWeight: 700,
    },
    h1: {
      fontSize: "2.125rem",
      color: theme.textSecondary,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: theme.customization.mode === "dark" ? theme.heading : theme.textDark,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      color: theme.textSecondary,
    },
    caption: {
      fontSize: "0.75rem",
      color: theme.textSecondary,
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334em",
      color: theme.textSecondary,
    },
    body2: {
      letterSpacing: "0em",
      fontWeight: 400,
      lineHeight: "1.5em",
      color: theme.textSecondary,
      fontSize: "16px",
    },
    customInput: {
      marginTop: 8,
      marginBottom: 8,
      "& > label": {
        top: "23px",
        left: 0,
        color: theme.grey500,
        '&[data-shrink="false"]': {
          top: "5px",
        },
      },
      "& > div > input": {
        padding: "30.5px 14px 11.5px !important",
      },
      "& legend": {
        display: "none",
      },
      "& fieldset": {
        top: 0,
      },
    },
    menuCaption: {
      fontSize: "0.875rem",
      color: theme.heading,
      padding: "11px 0 11px 19px",
      textTransform: "capitalize",
      fontWeight: "400",
    },
    subMenuCaption: {
      fontSize: "0.6875rem",
      fontWeight: 500,
      color: theme.textSecondary,
      textTransform: "capitalize",
    },
    commonAvatar: {
      cursor: "pointer",
      borderRadius: "8px",
    },
    smallAvatar: {
      width: "22px",
      height: "22px",
      fontSize: "1rem",
    },
    mediumAvatar: {
      width: "34px",
      height: "34px",
      fontSize: "1.2rem",
    },
    largeAvatar: {
      width: "44px",
      height: "44px",
      fontSize: "1.5rem",
    },
  };
}
