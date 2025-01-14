import React, { useEffect } from "react";

import { Pagination as MuiPagination } from "./Mui";
import { MainCard } from "./MainCard";
import { Flex } from "./Grid";

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
    <Flex fullWidth justify={flexEnd ? "flex-end" : ""} sx={{ marginTop: mt ?? "0px" }}>
      <Flex>
        <MainCard level={4} padding="12px">
          <MuiPagination
            count={Math.ceil(Number(total || "") / defaultPageSize)}
            page={pageNum}
            color="primary"
            shape="rounded"
            onChange={paginationChange}
          />
        </MainCard>
      </Flex>
    </Flex>
  );
}
