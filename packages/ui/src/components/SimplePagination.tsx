import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { LeftArrow, RightArrow } from "./Arrow";

export interface SimplePaginationProps {
  onPageChange: (page: number) => void;
  maxItems: number;
  length: number;
  page?: number;
}

export function SimplePagination({ maxItems = 10, length, page: _page, onPageChange }: SimplePaginationProps) {
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

  const handlePageChange = (type: "prev" | "next") => {
    if (type === "prev") {
      setPage(page === 1 ? page : page - 1);
      onPageChange(page === 1 ? page : page - 1);
    } else {
      setPage(page === maxPage ? page : page + 1);
      onPageChange(page === maxPage ? page : page + 1);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "0.2em",
        marginBottom: "0.5em",
        "@media (max-width: 640px)": {
          justifyContent: "flex-start",
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
