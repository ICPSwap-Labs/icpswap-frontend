import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ChevronRight } from "react-feather";

export interface BreadcrumbsProps {
  prevLink: string;
  prevLabel: ReactNode;
  currentLabel: ReactNode;
  fontSize?: string;
}

export function Breadcrumbs({ prevLabel, currentLabel, prevLink, fontSize = "12px" }: BreadcrumbsProps) {
  const history = useHistory();

  const handleClick = () => {
    if (prevLink === "back") {
      history.goBack();
      return;
    }
    history.push(prevLink);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "0 5px",
        padding: "8px 0",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize,
          color: "text.secondary",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={handleClick}
      >
        {prevLabel}
      </Typography>

      <ChevronRight size="18px" />

      <Typography color="text.primary" fontSize={fontSize}>
        {currentLabel}
      </Typography>
    </Box>
  );
}
