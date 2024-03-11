import React, { Ref } from "react";
import { useTheme } from "@mui/styles";
import { Card, CardHeader, Divider, Typography, Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

export interface MainCardProps {
  border?: boolean;
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
  borderRadius?: "string";
}

export interface MainCardRef {}

const MainCard = React.forwardRef(
  (
    {
      border = true,
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
      borderRadius,
      ...others
    }: MainCardProps,
    ref: Ref<MainCardRef>,
  ) => {
    const theme = useTheme() as Theme;

    const getCardStyle = ({ theme, level }: { theme: Theme; level: number }) => {
      switch (level) {
        case 1:
          return {
            background: theme.palette.background.level1,
          };
        case 2:
          return {
            background: theme.palette.background.level2,
            ...(border ? { border: "2px solid rgba(255, 255, 255, 0.04)" } : {}),
          };
        case 3:
          return {
            background: theme.palette.background.level3,
          };
        case 4:
          return {
            background: theme.palette.background.level4,
          };
        case 5:
          return {
            background: "#273051",
            border: "0.5px solid #404558",
          };
        default:
          return {
            background: theme.palette.background.level3,
          };
      }
    };

    const cardStyles = getCardStyle({ theme, level: level ? level : 0 });

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
          borderRadius: borderRadius ?? "16px",
          backgroundColor: cardStyles.background,
          ...(cardStyles.border ? { border: cardStyles.border } : {}),
          ...sx,
        }}
        onClick={onClick}
      >
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && (
          <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <Box
            sx={{
              padding: "16px",
              ...(contentSX ?? {}),
            }}
            className={contentClass}
          >
            {children}
          </Box>
        )}
        {!content && children}
      </Card>
    );
  },
);

export default MainCard;
