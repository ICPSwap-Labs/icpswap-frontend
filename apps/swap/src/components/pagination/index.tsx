import React from "react";
import { Grid, Menu, MenuItem, Pagination as PaginationComponent } from "@mui/material";
import { MainCard } from "components/index";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const PageSizeList = [10, 50, 100];

export type PaginationType = {
  pageNum: number;
  pageSize: number;
};

export interface PaginationProps {
  count: number;
  onPageChange?: (pagination: PaginationType) => void;
  onPageSizeChange?: (pagination: PaginationType) => void;
  defaultPageSize?: number;
  flexEnd?: boolean;
  showPageSize?: boolean;
}

export default ({
  count,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = 10,
  flexEnd,
  showPageSize = false,
}: PaginationProps) => {
  const [pageNum, setPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const paginationChange = (e: any, pageNum: number): void => {
    setPageNum(pageNum);
    if (onPageChange) {
      onPageChange({
        pageNum,
        pageSize,
      });
    }
  };

  const pageSizeChange = (pageSize: number) => {
    handleClose();
    setPageSize(pageSize);
    setPageNum(1);
    if (onPageSizeChange) {
      onPageSizeChange({
        pageNum: 1,
        pageSize,
      });
    }
  };

  return (
    <Grid container item xs={12} sx={{ mt: "14px" }}>
      <Grid container justifyContent={flexEnd ? "flex-end" : ""}>
        <Grid item xs container>
          <Grid item>
            <MainCard level={4} padding="12px">
              <PaginationComponent
                count={Math.ceil(Number(count || "") / pageSize)}
                page={pageNum}
                color="primary"
                shape="rounded"
                onChange={paginationChange}
              />
            </MainCard>
          </Grid>
        </Grid>
        {showPageSize && (
          <Grid item>
            <MainCard level={4} onClick={handleClick} padding="14px">
              <Grid container alignItems="center">
                {pageSize} Rows <ExpandMoreRoundedIcon sx={{ fontSize: "18px" }} />
              </Grid>
            </MainCard>
            <Menu
              id="menu-user-list-style2"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              variant="selectedMenu"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {PageSizeList.map((pageSize) => (
                <MenuItem key={pageSize} onClick={() => pageSizeChange(pageSize)}>
                  {pageSize} Rows
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
