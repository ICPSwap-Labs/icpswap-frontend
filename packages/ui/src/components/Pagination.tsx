import React, { useEffect } from "react";

import { Grid, Pagination as MuiPagination, Box } from "./Mui";
import { MainCard } from "./MainCard";

export type PaginationType = {
  pageNum: number;
  pageSize: number;
};

export interface PaginationProps {
  total: number;
  onPageChange?: (pagination: PaginationType) => void;
  flexEnd?: boolean;
  num?: number;
  defaultPageSize?: number;
  mt?: string;
}

export function Pagination({ total, onPageChange, defaultPageSize = 10, flexEnd, num, mt = "15px" }: PaginationProps) {
  const [pageNum, setPageNum] = React.useState(1);

  useEffect(() => {
    if (num !== undefined) {
      setPageNum(num);
    }
  }, [num]);

  const paginationChange = (e: React.ChangeEvent<unknown>, pageNum: number): void => {
    setPageNum(pageNum);
    if (onPageChange) {
      onPageChange({
        pageNum,
        pageSize: defaultPageSize,
      });
    }
  };

  return (
    <Grid container justifyContent={flexEnd ? "flex-end" : ""} mt={mt}>
      <Box>
        <MainCard level={4} padding="12px">
          <MuiPagination
            count={Math.ceil(Number(total || "") / defaultPageSize)}
            page={pageNum}
            color="primary"
            shape="rounded"
            onChange={paginationChange}
          />
        </MainCard>
      </Box>
    </Grid>
  );
}
