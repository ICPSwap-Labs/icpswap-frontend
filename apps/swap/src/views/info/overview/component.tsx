import { ReactNode } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { mockALinkAndOpen } from "@icpswap/utils";
import { useHistory } from "react-router-dom";
import { Flex, Tooltip } from "@icpswap/ui";
import { ArrowRight } from "react-feather";

export interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  return (
    <Flex
      sx={{
        margin: "0 0 32px 0",
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "32px 0",
          alignItems: "flex-start",
        },
      }}
    >
      {children}
    </Flex>
  );
}

export interface ItemProps {
  label: ReactNode;
  value: number | string | undefined;
  tooltip?: string;
}

export function Item({ label, value, tooltip }: ItemProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <Flex gap="0 5px">
        <Typography component="div">{label}</Typography>
        {tooltip ? <Tooltip tips={tooltip} /> : null}
      </Flex>
      <Typography color="text.primary" sx={{ fontSize: "20px", fontWeight: 500, margin: "12px 0 0 0" }}>
        {value}
      </Typography>
    </Box>
  );
}

export function LinkArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="10" fill="white" fillOpacity="0.17" />
      <path
        opacity="0.6"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5858 12C11.5858 11.4477 12.0335 11 12.5858 11H19.5858C20.1381 11 20.5858 11.4477 20.5858 12V19C20.5858 19.5523 20.1381 20 19.5858 20C19.0335 20 18.5858 19.5523 18.5858 19L18.5858 14.6064L12.7071 20.4851C12.3166 20.8757 11.6834 20.8757 11.2929 20.4851C10.9024 20.0946 10.9024 19.4614 11.2929 19.0709L17.3638 13H12.5858C12.0335 13 11.5858 12.5523 11.5858 12Z"
        fill="white"
      />
    </svg>
  );
}

export interface LinkArrowProps {
  link?: string;
  to?: string;
}

export function LinkArrow({ link, to }: LinkArrowProps) {
  const history = useHistory();

  const handleClick = () => {
    if (to) {
      history.push(to);
      return;
    }

    if (link) {
      mockALinkAndOpen(link, "overview-link");
    }
  };

  return (
    <Box sx={{ cursor: "pointer" }} onClick={handleClick}>
      <LinkArrowIcon />
    </Box>
  );
}

export interface TitleProps {
  title: string;
  link?: string;
  to?: string;
  isICP?: boolean;
}

export function Title({ title, link, to, isICP }: TitleProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", margin: isICP ? "0 0 10px 0" : "0 0 35px 0" }}>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 500,
          color: "#FFFFFF",
        }}
        gutterBottom
        component="div"
      >
        {title}
      </Typography>
      <LinkArrow link={link} to={to} />
    </Box>
  );
}

export interface CardProps {
  children: ReactNode;
  title: ReactNode;
}

export function Card({ title, children }: CardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "24px",
        border: `1px solid ${theme.palette.border["2"]}`,
        background: theme.palette.background.level4,
        padding: "20px 32px",
        cursor: "pointer",
        [theme.breakpoints.down("sm")]: {
          padding: "16px 15px",
        },
        "&.footer": {
          padding: "16px 24px",
          [theme.breakpoints.down("sm")]: {
            padding: "16px 24px",
          },
        },
        "& .arrow": {
          display: "none",
        },
        "&:hover": {
          "& .arrow": {
            display: "block",
          },
        },
      }}
    >
      <Flex justify="space-between">
        {title}

        <Box className="arrow">
          <ArrowRight color="#ffffff" />
        </Box>
      </Flex>
      {children}
    </Box>
  );
}
