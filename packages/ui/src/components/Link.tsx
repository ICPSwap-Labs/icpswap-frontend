import { Link as ReactLink } from "react-router-dom";
import { ReactNode } from "react";

import { useTheme } from "./Mui";

export interface LinkProps {
  to?: string;
  link?: string;
  color?: "secondary" | "primary";
  children: ReactNode;
  width?: string;
  height?: string;
  display?: "flex" | "block" | "inline-block" | "inline";
}

export function Link({ to, link, color, children, width, height, display }: LinkProps) {
  const theme = useTheme();

  const __color =
    color === "primary" ? theme.colors.primaryMain : color === "secondary" ? theme.colors.secondaryMain : "inherit";

  return (
    <>
      {to ? (
        <ReactLink
          to={to}
          style={{ width, height, display, textDecoration: "none", userSelect: "none", color: __color }}
        >
          {children}
        </ReactLink>
      ) : link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            width,
            height,
            display,
            textDecoration: "none",
            color: __color,
          }}
        >
          {children}
        </a>
      ) : (
        children
      )}
    </>
  );
}
