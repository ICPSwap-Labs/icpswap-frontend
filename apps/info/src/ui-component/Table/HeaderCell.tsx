import { useCallback, useContext } from "react";
import { Typography } from "@mui/material";
import HeaderContext from "./headerContext";
import { SortDirection } from "./types";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import { UpArrow, DownArrow } from "ui-component/Arrow";

export type HeaderCellProps = {
  isSort?: boolean;
  sortField?: string;
  field?: string;
  sortDirection?: SortDirection;
  color?: string;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  onClick?: (event: any) => void;
  children: React.ReactNode;
};

export default function HeaderCell({ isSort, field, ...props }: HeaderCellProps) {
  const theme = useTheme() as Theme;

  const { sortChange, sortField, sortDirection } = useContext(HeaderContext);

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? sortDirection === SortDirection.ASC ? <UpArrow /> : <DownArrow /> : "";
    },
    [sortDirection, sortField],
  );

  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (isSort && field) {
      sortChange(field, sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
    }
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: theme.colors.darkPrimary400,
        display: "flex",
        alignItems: "center",
        justifyContent: props.align === "right" ? "flex-end" : "flex-start",
        fontSize: "16px",
        fontWeight: 400,
        "@media screen and (max-width: 600px)": {
          fontSize: "12px",
        },
      }}
      color={props.color}
      onClick={handleClick}
      component="div"
    >
      {props.children} {field ? arrow(field) : null}
    </Typography>
  );
}
