import { makeStyles } from "components/Mui";
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
  children: React.ReactNode;
}

export function Link({ to, link, children }: LinkProps) {
  const classes = useStyles();

  return (
    <>
      {to ? (
        <ReactLink className={classes.link} to={to}>
          {children}
        </ReactLink>
      ) : link ? (
        <a href={link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          {children}
        </a>
      ) : (
        children
      )}
    </>
  );
}
