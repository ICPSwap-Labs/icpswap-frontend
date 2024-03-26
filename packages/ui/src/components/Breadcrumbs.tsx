import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs as MuiBreadcrumbs } from "@mui/material";

export interface BreadcrumbsProps {
  prevLink: string;
  prevLabel: ReactNode;
  currentLabel: ReactNode;
}

export function Breadcrumbs({ prevLabel, currentLabel, prevLink }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs
      sx={{
        "& a": {
          textDecoration: "none",
          fontSize: "12px",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
    >
      <Link to={prevLink}>
        <Typography color="secondary">{prevLabel}</Typography>
      </Link>

      <Typography fontSize="12px">{currentLabel}</Typography>
    </MuiBreadcrumbs>
  );
}
