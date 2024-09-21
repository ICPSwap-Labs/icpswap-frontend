import { isDarkTheme } from "utils/index";
import { createTheme, keyframes } from "@mui/material";

import colors from "./colors";

const MuiTheme = createTheme({});

export function componentStyleOverrides(theme: { [key: string]: any }) {
  const isDark = isDarkTheme(theme);

  const globalButtonBackground = isDark ? theme.defaultGradient : theme.colors.lightPrimaryMain;

  const menuHoverBackground = isDark ? theme.menuSelectedBack : theme.colors.lightLevel2;

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
          lineHeight: 1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "8px",
          textTransform: "none",
          "&.MuiButton-outlinedPrimary": {
            color: isDark ? theme.colors.secondaryMain : theme.colors.lightPrimaryMain,
            borderColor: isDark ? theme.colors.secondaryMain : theme.colors.lightPrimaryMain,
            "&:hover": {
              background: "rgba(86, 105, 220, 0.1)",
            },
            "&.secondary": {
              border: `1px solid ${colors.darkLevel4}`,
              color: "#ffffff",
            },
          },
          "&.MuiButton-contained.Mui-disabled": {
            ...(isDark
              ? {
                  background: "#4F5A84",
                }
              : { color: "#9E9E9E", background: "#E0E0E0" }),
          },
          "&.MuiButton-contained": {
            "&.secondary": {
              background: colors.darkLevel4,
              boxShadow: "none",
              "&.Mui-disabled": {
                color: colors.darkTextTertiary,
              },
            },
          },
        },
        containedPrimary: {
          background: globalButtonBackground,
          "&.MuiButton-sizeLarge": {
            padding: "11px 22px",
          },
        },
        containedSecondary: {
          background: isDark ? theme.colors.darkLevel4 : "#EFEFFF",
          color: isDark ? "#ffffff" : theme.colors.primaryMain,
          border: "1px solid #5569DB",
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
          backgroundColor: isDark ? theme.colors.darkLevel1 : theme.colors.paper,

          // Date pick button
          "&.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8": {
            "& .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium": {
              "&:hover": {
                backgroundColor: theme.colors.primaryMain,
              },
              "& .MuiTypography-caption": {
                color: "#fff",
              },
            },
          },
        },
        rounded: {
          borderRadius: `${theme.borderRadius}px`,
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
              paddingBottom: "12px",
            },
          },
          [MuiTheme.breakpoints.down("sm")]: {
            padding: "12px",
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
            borderRadius: "12px",
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
              color: "#8492C4",
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
              color: "#8492C4",
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
          },
        },
        input: {
          color: theme.textDark,
          "&::placeholder": {
            color: theme.textSecondary,
            fontSize: "0.875rem",
            fontWeight: 400,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: isDark ? theme.colors.darkBackground : theme.colors.grey50,
          borderRadius: `${theme.borderRadius}px`,
          "& fieldset": {
            borderColor: theme.colors.darkTextSecondary,
          },
          "&:hover $notchedOutline": {
            borderColor: theme.colors.primaryLight,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: isDark ? theme.colors.darkBackground : theme.colors.grey50,
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
          borderColor: theme.colors.secondary,
          borderRadius: `${theme.borderRadius}px`,
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
          borderColor: theme.divider,
          opacity: isDark ? 0.2 : 1,
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
          backgroundColor: isDark ? theme.colors.darkLevel3 : theme.colors.primary200,
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
          borderColor: isDark ? "rgba(189, 200, 240, 0.082)" : theme.colors.grey200,
          "&.MuiTableCell-head": {
            fontSize: theme.fontSize.xs,
            color: theme.textTertiary,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#ffffff",
          borderRadius: "8px",
          padding: "12px 16px",
          maxWidth: "300px",
          color: "#111936",
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: 400,
          "& .MuiTooltip-arrow": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          // ".Mui-selected": {
          //   backgroundColor: theme.colors.primaryMain,
          // },
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
          borderRadius: "12px",
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
              border: "1px solid #49588E",
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
                  background: "#313D67",
                },
                "&:hover": {
                  background: "#313D67",
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
            border: "1px solid #49588E",
            borderRadius: "8px",
            width: "146px",
            overflow: "hidden",
            "& .MuiMenuItem-root.MuiButtonBase-root": {
              background: theme.colors.darkLevel3,
              paddingTop: "10px",
              paddingBottom: "10px",
              margin: "5px 0",
              "&.active": {
                background: "#313D67",
              },
              "&:hover": {
                background: "#313D67",
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
            "& .Mui-disabled.opacity1": {
              opacity: 1,
            },
          },
          "&.customize-menu-list-light": {
            padding: 0,
            background: "#ffffff",
            border: "1px solid #EFEFFF",
            borderRadius: "12px",
            width: "146px",
            overflow: "hidden",
            "& .MuiMenuItem-root.MuiButtonBase-root": {
              background: "#ffffff",
              paddingTop: "10px",
              paddingBottom: "10px",
              "&:first-of-type": {
                borderRadius: "12px 12px 0 0",
              },
              "&:last-child": {
                borderRadius: "0 0 12px 12px",
              },
              "&.active": {
                background: "#F5F5FF",
              },
              "&:hover": {
                background: "#F5F5FF",
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
  };
}
