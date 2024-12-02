import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { ChevronRight } from "react-feather";

import { Link } from "./Link";
import { Typography, Box } from "./Mui";
import { Flex } from "./Grid";

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

function Breadcrumb({ fontSize = "12px", current, label }: { fontSize?: string; current: boolean; label: ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize,
        color: current ? "text.primary" : "text.secondary",
        cursor: current ? "default" : "pointer",
        "&:hover": {
          textDecoration: current ? "none" : "underline",
        },
      }}
    >
      {label}
    </Typography>
  );
}

interface BreadcrumbProps {
  link?: string;
  label: ReactNode;
}

export interface BreadcrumbsV1Props {
  links: BreadcrumbProps[];
  fontSize?: string;
}

export function BreadcrumbsV1({ links, fontSize = "12px" }: BreadcrumbsV1Props) {
  return (
    <Flex
      gap="0 5px"
      sx={{
        padding: "8px 0",
      }}
    >
      {links.map(({ label, link }, index) => (
        <Flex gap="0 5px" key={link || index}>
          {link ? (
            <Link to={link}>
              <Breadcrumb label={label} fontSize={fontSize} current={index === links.length - 1} />
            </Link>
          ) : (
            <Breadcrumb label={label} fontSize={fontSize} current={index === links.length - 1} />
          )}

          {index !== links.length - 1 ? <ChevronRight size="18px" /> : null}
        </Flex>
      ))}
    </Flex>
  );
}
