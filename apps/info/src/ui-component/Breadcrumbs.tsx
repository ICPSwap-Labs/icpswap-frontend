import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    breadcrumbs: {
      "& a": {
        textDecoration: "none",
        fontSize: "12px",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  };
});

export default function _Breadcrumbs({
  prevLabel,
  currentLabel,
  prevLink,
}: {
  prevLink: string;
  prevLabel: ReactNode;
  currentLabel: ReactNode;
}) {
  const classes = useStyles();

  return (
    <Breadcrumbs className={classes.breadcrumbs}>
      <Link to={prevLink}>
        <Typography color="secondary">{prevLabel}</Typography>
      </Link>

      <Typography fontSize="12px">{currentLabel}</Typography>
    </Breadcrumbs>
  );
}
