import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";
import { mockALinkToOpen } from "utils";

export interface TextButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  link?: string;
  to?: string;
  sx?: any;
}

export default function TextButton({ children, onClick = () => {}, disabled, link, to, sx }: TextButtonProps) {
  const history = useHistory();

  const handleClick = () => {
    if (link) {
      mockALinkToOpen(link, "text-button-open-new-window");
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
      color={link ? "primary" : "secondary"}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        "& +.custom-text-button": {
          marginLeft: "18px",
        },
        "@media screen and (max-width: 640px)": { fontSize: "14px" },
        ...(sx ?? {}),
      }}
      className="custom-text-button"
      component="span"
      onClick={() => {
        if (Boolean(disabled)) return;
        handleClick();
      }}
    >
      {children}
    </Typography>
  );
}
