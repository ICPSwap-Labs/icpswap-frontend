import { styled, useTheme } from "components/Mui";
import { Link as ReactLink } from "react-router-dom";

const StyledLink = styled(ReactLink)(() => ({
  textDecoration: "none",
  userSelect: "none",
}));

export interface LinkProps {
  to?: string;
  link?: string;
  color?: "secondary" | "primary";
  children: React.ReactNode;
  width?: string;
  height?: string;
  display?: "flex" | "block" | "inline-block" | "inline";
}

export function Link({ to, link, color, children, width, height, display }: LinkProps) {
  const theme = useTheme();

  return (
    <>
      {to ? (
        <StyledLink to={to} style={{ width, height, display }}>
          {children}
        </StyledLink>
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
            color:
              color === "primary"
                ? theme.colors.primaryMain
                : color === "secondary"
                  ? theme.colors.secondaryMain
                  : "inherit",
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
