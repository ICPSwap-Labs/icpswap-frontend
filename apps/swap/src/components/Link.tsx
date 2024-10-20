import { makeStyles, useTheme } from "components/Mui";
import { Link as ReactLink } from "react-router-dom";

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: "none",
    userSelect: "none",
  },
}));

export interface LinkProps {
  to?: string;
  link?: string;
  color?: "secondary" | "primary";
  children: React.ReactNode;
}

export function Link({ to, link, color, children }: LinkProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      {to ? (
        <ReactLink className={classes.link} to={to}>
          {children}
        </ReactLink>
      ) : link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
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
