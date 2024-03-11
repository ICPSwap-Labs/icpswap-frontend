import React, { Ref } from "react";
import { useTheme } from "@mui/styles";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";

const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

export type MainCardBorder = "level1" | "level2" | "level3" | "level4";

export interface MainCardProps {
  border?: MainCardBorder;
  boxShadow?: boolean;
  children: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: any;
  darkTitle?: boolean;
  secondary?: any;
  shadow?: string;
  sx?: any;
  title?: string;
  level?: number;
  onClick?: (event: any) => void;
  className?: any;
}

export interface MainCardRef {}

const MainCard = React.forwardRef(
  (
    {
      border,
      boxShadow,
      children,
      content = true,
      contentClass,
      contentSX,
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      level,
      onClick,
      className,
      ...others
    }: MainCardProps,
    ref: Ref<MainCardRef>,
  ) => {
    const theme = useTheme() as Theme;

    const getCardStyle = ({
      theme,
      level,
      border,
    }: {
      theme: Theme;
      level: number;
      border: MainCardBorder | undefined;
    }) => {
      const _border =
        border === "level1"
          ? theme.palette.background.level1
          : border === "level2"
          ? theme.palette.background.level2
          : border === "level3"
          ? theme.palette.background.level3
          : border === "level4"
          ? theme.palette.background.level4
          : undefined;

      switch (level) {
        case 1:
          return {
            background: theme.palette.background.level1,
            ...(!!_border ? { border: `1px solid ${_border}` } : {}),
          };
        case 2:
          return {
            background: theme.palette.background.level2,
            ...(border ? { border: "2px solid rgba(255, 255, 255, 0.04)" } : {}),
          };
        case 3:
          return {
            background: theme.palette.background.level3,
            ...(!!_border ? { border: `1px solid ${_border}` } : {}),
          };
        case 4:
          return {
            background: theme.palette.background.level4,
            ...(!!_border ? { border: `1px solid ${_border}` } : {}),
          };
        case 5:
          return {
            background: "#273051",
            border: "0.5px solid #404558",
          };
        default:
          return {
            background: theme.palette.background.level3,
            ...(!!_border ? { border: `1px solid ${_border}` } : {}),
          };
      }
    };

    const cardStyles = getCardStyle({ theme, level: level ? level : 0, border });

    return (
      <Card
        {...others}
        className={className}
        sx={{
          ":hover": {
            boxShadow: boxShadow
              ? shadow
                ? shadow
                : theme.palette.mode === "dark"
                ? "0 2px 14px 0 rgb(33 150 243 / 10%)"
                : "0 2px 14px 0 rgb(32 40 45 / 8%)"
              : "inherit",
          },
          backgroundColor: cardStyles.background,
          ...(cardStyles.border ? { border: cardStyles.border } : {}),
          ...sx,
        }}
        onClick={onClick}
      >
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}

        {!content && children}
      </Card>
    );
  },
);

export default MainCard;
