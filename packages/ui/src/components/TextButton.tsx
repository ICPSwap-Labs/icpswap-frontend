import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { mockALinkAndOpen } from "@icpswap/utils";

import { Typography, Box } from "./Mui";

export interface ALinkProps {
  children: ReactNode;
  link: string | undefined;
  color?: string;
  textDecorationColor?: "primary" | "secondary" | "text.secondary";
  fontSize?: string;
  align?: "right";
  text?: boolean;
}

export function ALink({
  children,
  link,
  textDecorationColor = "text.secondary",
  color = "",
  fontSize = "14px",
  align,
  text = true,
}: ALinkProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{
        textDecoration: text ? "underline" : "none",
        fontSize,
        textDecorationColor:
          textDecorationColor === "primary"
            ? "rgb(134, 114, 255)"
            : textDecorationColor === "secondary"
            ? "rgb(86, 105, 220)"
            : "#8492c4",
        color,
        textAlign: align,
      }}
    >
      {text ? (
        <Typography
          color={color ?? "text.secondary"}
          sx={{
            cursor: "pointer",
            userSelect: "none",
            fontSize,
          }}
          component="span"
        >
          {children}
        </Typography>
      ) : (
        children
      )}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.43866 2.42969H1.15951V0.429688H8.85528H9.85528V1.42969V9.12545H7.85528V3.8415L1.94156 9.75521L0.527344 8.341L6.43866 2.42969Z"
        fill="#5669DC"
      />
    </svg>
  );
}

export interface TextButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  link?: string;
  to?: string;
  sx?: any;
  arrow?: boolean;
  color?: "primary" | "white" | "secondary";
  textDecoration?: "underline" | "none";
}

export function TextButton({
  children,
  onClick,
  disabled,
  link,
  to,
  sx,
  arrow,
  color = "secondary",
  textDecoration = "none",
}: TextButtonProps) {
  const history = useHistory();

  const handleClick = () => {
    if (link) {
      mockALinkAndOpen(link, "text-button-open-new-window");
      return;
    }

    if (to) {
      history.push(to);
      return;
    }

    if (onClick) onClick();
  };

  return (
    <Typography
      color={disabled ? "#4F5A84" : color === "primary" ? "primary" : color === "white" ? "#ffffff" : "secondary"}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        textDecoration,
        "&:hover": {
          textDecoration: "underline",
        },
        "& +.custom-text-button": {
          marginLeft: "18px",
        },
        ...sx,
      }}
      className="custom-text-button"
      component="span"
      onClick={() => {
        if (disabled) return;
        handleClick();
      }}
    >
      {children}

      {arrow && (
        <Box component="span" sx={{ margin: "0 0 0 5px" }}>
          <ArrowIcon />
        </Box>
      )}
    </Typography>
  );
}
