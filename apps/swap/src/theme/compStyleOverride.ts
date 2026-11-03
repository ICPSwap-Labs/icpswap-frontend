import { createTheme, keyframes } from "components/Mui";
import { isDarkTheme } from "utils/index";

import colors from "./colors";

const MuiTheme = createTheme({});

export function componentStyleOverrides(theme: { [key: string]: any }) {
  const isDark = isDarkTheme(theme);

  const globalButtonBackground = theme.defaultGradient;

  const menuHoverBackground = "color-mix(in srgb, var(--color-primary) 12%, transparent)";

  const CircularProgressKeyframes0 = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

  const CircularProgressKeyframes1 = keyframes`
    0% {
      stroke-dasharray: 1px,200px;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 100px,200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px,200px;
      stroke-dashoffset: -125px;
    }
  `;

  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: 1.4,
          "&.fontSize14": {
            fontSize: "14px",
            "@media(max-width: 640px)": {
              fontSize: "12px",
            },
          },
          "&.fontSize12": {
            fontSize: "12px",
            "@media(max-width: 640px)": {
              fontSize: "12px",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "var(--radius-field)",
          textTransform: "none",
          letterSpacing: "0.01em",
          transition: "background 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
          "&.Mui-focusVisible": {
            outline: "2px solid var(--color-primary)",
            outlineOffset: "3px",
          },
          "&.MuiButton-outlinedPrimary": {
            color: "var(--color-primary)",
            borderColor: "color-mix(in srgb, var(--color-primary) 40%, transparent)",
            "&:hover": {
              background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
            },
            "&.secondary": {
              border: "1px solid var(--color-base-300)",
              color: "var(--color-base-content)",
            },
          },
          "&.MuiButton-contained.Mui-disabled": {
            color: "color-mix(in srgb, var(--color-base-content) 38%, transparent)",
            background: "var(--color-base-300)",
            boxShadow: "none",
          },
          "&.MuiButton-contained": {
            "&.secondary": {
              background: "var(--color-base-300)",
              boxShadow: "none",
              "&.Mui-disabled": {
                color: colors.darkTextTertiary,
              },
            },
          },
          "&.MuiButton-outlined": {
            "&.Mui-disabled": {
              color: "var(--color-neutral)",
              border: "1px solid var(--color-base-300)",
            },
          },
        },
        containedPrimary: {
          background: globalButtonBackground,
          color: "var(--color-primary-content)",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedSecondary: {
          background: "color-mix(in srgb, var(--color-primary) 10%, var(--color-base-100))",
          color: "var(--color-primary)",
          border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "var(--color-base-100)",

          // Date pick button
          "&.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8": {
            "& .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium": {
              "&:hover": {
                backgroundColor: "var(--color-primary)",
              },
              "& .MuiTypography-caption": {
                color: "var(--color-primary-content)",
              },
            },
          },
        },
        rounded: {
          borderRadius: "var(--radius-box)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors.textDark,
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",

          "&:last-child": {
            [MuiTheme.breakpoints.down("sm")]: {
              paddingBottom: "6px",
            },
          },
          [MuiTheme.breakpoints.down("sm")]: {
            padding: "6px",
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
        outlined: {
          border: "1px dashed",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.radius-12": {
            borderRadius: "6px",
          },
          "&.MuiListItem-root": {
            color: theme.textSecondary,
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: theme.menuBackground,
            "&.Mui-selected": {
              color: theme.textPrimary,
              backgroundColor: menuHoverBackground,
              "&:hover": {
                backgroundColor: menuHoverBackground,
              },
              "& .MuiListItemIcon-root": {
                color: theme.textPrimary,
              },
            },
            "&:hover": {
              backgroundColor: menuHoverBackground,
              color: theme.textPrimary,
              "& .MuiListItemIcon-root": {
                color: theme.textPrimary,
              },
            },
          },

          // sidebar menu
          "&.MuiListItem-root&.sidebar": {
            color: theme.textPrimary,
            paddingTop: "10px",
            paddingBottom: "10px",
            marginBottom: "5px",
            paddingLeft: "0px",
            "&:last-child": {
              marginBottom: 0,
            },
            "& .MuiSvgIcon-root": {
              color: "var(--color-neutral-content)",
            },
            "&.Mui-selected, &:hover": {
              color: theme.menuSelected,
              background: globalButtonBackground,
              "& .MuiListItemIcon-root": {
                color: theme.menuSelected,
              },
              "& .MuiSvgIcon-root": {
                color: theme.menuSelected,
              },
            },
          },
          "&.MuiListItem-root&.sub": {
            color: theme.textPrimary,
            paddingTop: "7px",
            paddingBottom: "7px",
            paddingLeft: "0px",
            background: "transparent",
            "& .MuiSvgIcon-root": {
              color: "var(--color-neutral-content)",
            },
            "&.Mui-selected, &:hover": {
              color: theme.menuSelected,
              background: "transparent",
              "& .MuiListItemIcon-root": {
                color: theme.menuSelected,
              },
              "& .MuiSvgIcon-root": {
                color: theme.colors.darkSecondaryMain,
              },
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            fontSize: "16px",
            fontVariantNumeric: "tabular-nums",
          },
        },
        input: {
          color: "var(--color-base-content)",
          "&::placeholder": {
            color: "var(--color-neutral-content)",
            fontSize: "0.875rem",
            fontWeight: 400,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "var(--color-base-200)",
          borderRadius: "var(--radius-field)",
          "& fieldset": {
            borderColor: "var(--color-base-300)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "color-mix(in srgb, var(--color-primary) 50%, transparent)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary)",
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: "transparent",
          padding: "15.5px 14px",
          borderRadius: `${theme.borderRadius}px`,
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderColor: "var(--color-base-300)",
          borderRadius: "var(--radius-field)",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: isDark ? theme.colors.textPrimary + 50 : theme.colors.grey300,
          },
        },
        mark: {
          backgroundColor: theme.paper,
          width: "4px",
        },
        valueLabel: {
          color: theme.colors.primaryMain,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiAutocomplete-tag": {
            background: isDark ? theme.colors.textPrimary + 20 : theme.colors.secondaryLight,
            borderRadius: 4,
            color: theme.textDark,
            ".MuiChip-deleteIcon": {
              color: isDark ? theme.colors.textPrimary + 80 : theme.colors.secondary200,
            },
          },
        },
        popper: {
          borderRadius: `${theme.borderRadius}px`,
          boxShadow:
            "0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "var(--color-base-300)",
          opacity: 1,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        select: {
          fontSize: "28px",
        },
        root: {
          padding: 0,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: isDark ? theme.colors.darkLevel1 : theme.colors.primaryDark,
          background: isDark ? theme.textPrimary : theme.colors.primary200,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          color: theme.textDark,
          fontSize: "16px",
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        label: {
          marginTop: 14,
          marginBottom: 14,
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiInternalDateTimePickerTabs: {
      styleOverrides: {
        tabs: {
          backgroundColor: isDark ? theme.colors.darkPaper : theme.colors.primaryLight,
          "& .MuiTabs-flexContainer": {
            borderColor: isDark ? theme.colors.textPrimary + 20 : theme.colors.primary200,
          },
          "& .MuiTab-root": {
            color: isDark ? theme.colors.textSecondary : theme.colors.grey900,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.colors.primaryDark,
          },
          "& .Mui-selected": {
            color: theme.colors.primaryDark,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          borderBottom: "1px solid",
          borderColor: isDark ? theme.colors.textPrimary + 20 : theme.colors.grey200,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "12px 0 12px 0",
          backgroundColor: "var(--color-base-100)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "var(--radius-box)",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& td": {
            whiteSpace: "nowrap",
          },
          "& td:first-of-type, & th:first-of-type": {
            paddingLeft: "0px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "color-mix(in srgb, var(--color-base-content) 6%, transparent)",
          fontVariantNumeric: "tabular-nums",
          "&.MuiTableCell-head": {
            fontSize: theme.fontSize.xs,
            color: "var(--color-neutral-content)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "var(--color-base-content)",
          borderRadius: "8px",
          padding: "12px 16px",
          maxWidth: "300px",
          color: "var(--color-base-200)",
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: 400,
          "& .MuiTooltip-arrow": {
            color: "var(--color-base-200)",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          ".MuiPaginationItem-previousNext": {
            borderRadius: "50%",
          },
          ".MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: theme.colors.secondaryMain,
            },
          },
          ".MuiButtonBase-root": {
            minWidth: "22px",
            height: "22px",
          },
        },
        nav: {
          backgroundColor: theme.colors.primaryMain,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: "relative",
          "&.with-loading": {
            minHeight: "210px",
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepLabel-label": {
            color: isDark ? theme.textSecondary : theme.textPrimary,
            "&.Mui-active": {
              color: theme.textPrimary,
            },
          },
          "& .MuiStepIcon-root": {
            color: isDark ? theme.colors.darkLevel4 : "#BDBDBD",
            "&.Mui-active": {
              color: isDark ? theme.colors.darkSecondaryMain : theme.colors.lightPrimaryMain,
            },
            "&.MuiStepIcon-completed": {
              color: isDark ? theme.colors.darkSecondaryMain : "#00C853",
            },
          },
          "& .MuiStepConnector-line": {
            borderColor: isDark ? theme.colors.darkLevel4 : "#E0E0E0",
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          "& a": {
            "&:hover": {
              textDecoration: `underline solid ${theme.textSecondary}!important`,
            },
            "& .MuiTypography-root": {
              color: theme.textSecondary,
            },
          },
          "& .MuiTypography-root": {
            color: theme.textPrimary,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: "36px",
          borderRadius: "6px",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "& .lightGray200": {
            ...(theme.customization.mode !== "dark" ? { backgroundColor: theme.colors.lightGray200 } : {}),
          },
          "& .lightGray50": {
            ...(theme.customization.mode !== "dark" ? { backgroundColor: theme.colors.lightGray50 } : {}),
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          "&.custom-select": {
            "& .MuiPaper-root": {
              background: theme.colors.darkLevel3,
              border: "1px solid var(--color-base-300)",
              borderRadius: "8px",
              "& .MuiList-root": {
                padding: 0,
              },
              "& .MuiMenuItem-root": {
                background: theme.colors.darkLevel3,
                paddingTop: "13px",
                paddingBottom: "13px",
                color: theme.textPrimary,
                "&.disabled": {
                  background: theme.colors.darkLevel4,
                  opacity: 0.3,
                  cursor: "not-allowed",
                  "&:hover": {
                    background: theme.colors.darkLevel4,
                    opacity: 0.3,
                  },
                  "&.active": {
                    background: theme.colors.darkLevel4,
                    opacity: 0.3,
                  },
                },
                "&.active": {
                  background: "var(--color-base-300)",
                },
                "&:hover": {
                  background: "var(--color-base-300)",
                },
              },
            },
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          "&.customize-menu-list": {
            padding: 0,
            background: theme.colors.darkLevel3,
            border: "1px solid var(--color-base-300)",
            borderRadius: "8px",
            width: "146px",
            overflow: "hidden",
            "& .MuiMenuItem-root.MuiButtonBase-root": {
              background: theme.colors.darkLevel3,
              paddingTop: "10px",
              paddingBottom: "10px",
              margin: "5px 0",
              "&.active": {
                background: "var(--color-base-300)",
              },
              "&:hover": {
                background: "var(--color-base-300)",
              },
            },
            "&.style1": {
              background: theme.colors.darkLevel1,
              border: `1px solid  ${theme.colors.darkLevel3}`,
              "& .MuiMenuItem-root.MuiButtonBase-root": {
                background: theme.colors.darkLevel1,
                "&.active": {
                  background: theme.colors.darkLevel3,
                  "& .customize-label": {
                    color: "#fff",
                  },
                },
                "& .customize-label.active": {
                  color: "#fff",
                },
                "&:hover": {
                  background: theme.colors.darkLevel3,
                  "& .customize-label": {
                    color: "#fff",
                  },
                },
              },
            },
          },
          "&.customize-menu-list-light": {
            padding: 0,
            background: "var(--color-base-content)",
            border: "1px solid var(--color-base-300)",
            borderRadius: "6px",
            width: "146px",
            overflow: "hidden",
            "& .MuiMenuItem-root.MuiButtonBase-root": {
              background: "var(--color-base-content)",
              paddingTop: "10px",
              paddingBottom: "10px",
              "&:first-of-type": {
                borderRadius: "12px 12px 0 0",
              },
              "&:last-child": {
                borderRadius: "0 0 12px 12px",
              },
              "&.active": {
                background: "var(--color-base-200)",
              },
              "&:hover": {
                background: "var(--color-base-200)",
              },
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animation: `${CircularProgressKeyframes0} 0.8s linear infinite`,
          "& .MuiCircularProgress-circle": {
            animation: `${CircularProgressKeyframes1} 0.8s ease-in-out infinite`,
          },
        },
      },
    },
    MuiPickersTextField: {
      styleOverrides: {
        root: {
          "& .MuiPickersInputBase-root": {
            background: colors.darkLevel1,
            borderRadius: "6px",
          },
          "& .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "& .MuiPickersInputBase-root.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
        },
      },
    },
  };
}
