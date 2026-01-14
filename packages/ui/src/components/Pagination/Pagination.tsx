import { useState, useEffect, useCallback } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";

import { LeftArrow, RightArrow } from "../Arrow";
import { Box, Typography } from "../Mui";

export type PaginationPadding = { lg?: string; sm?: string };

export interface PaginationProps {
  onPageChange?: (page: number) => void;
  maxItems?: number;
  length: number;
  page?: number;
  justify?: "center" | "flex-start" | "flex-end";
  padding?: PaginationPadding;
}

export function Pagination({
  maxItems = 10,
  length,
  page: _page,
  justify,
  onPageChange,
  padding = { lg: "24px 0 0 0", sm: "16px 0 0 0" },
}: PaginationProps) {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    let extraPages = 1;

    if (length % maxItems === 0) {
      extraPages = 0;
    }

    setMaxPage(Math.floor(length / maxItems) + extraPages);
  }, [maxItems, length]);

  useEffect(() => {
    if (_page !== undefined) {
      setPage(_page);
    }
  }, [_page]);

  const handlePageChange = useCallback(
    (type: "prev" | "next") => {
      if (isUndefinedOrNull(onPageChange)) return;

      if (type === "prev") {
        setPage(page === 1 ? page : page - 1);
        onPageChange(page === 1 ? page : page - 1);
      } else {
        setPage(page === maxPage ? page : page + 1);
        onPageChange(page === maxPage ? page : page + 1);
      }
    },
    [page, onPageChange, maxPage],
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: justify ?? "center",
        padding: padding.lg,
        "@media (max-width: 640px)": {
          justifyContent: "flex-start",
          padding: padding.sm,
        },
      }}
    >
      <Box
        onClick={() => {
          handlePageChange("prev");
        }}
      >
        <Box
          sx={{
            color: "#fff",
            opacity: page === 1 ? 0.5 : 1,
            padding: "0 16px",
            userSelect: "none",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <LeftArrow />
        </Box>
      </Box>
      <Typography color="text.primary" fontWeight={500}>
        {`Page ${page} of ${maxPage}`}
      </Typography>
      <Box
        onClick={() => {
          handlePageChange("next");
        }}
      >
        <Box
          sx={{
            color: "#fff",
            opacity: page === maxPage ? 0.5 : 1,
            padding: "0 16px",
            userSelect: "none",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <RightArrow />
        </Box>
      </Box>
    </Box>
  );
}
