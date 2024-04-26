import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, TextField, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MainCard, FilledTextField } from "components/index";
import { t } from "@lingui/macro";
import { IconSearch } from "@tabler/icons";
import { customizeBreakPoints } from "theme/customizeThemeBreakpoints";
import debounce from "lodash/debounce";
import { Theme } from "@mui/material/styles";
import Wrapper from "components/Wrapper";
import { useParsedQueryString } from "@icpswap/hooks";
import NFTMarketplace from "./NFTMarket";
import NFTMarketSaleRecords from "./NFTMarketSaleRecords";
import NFTUserSaleRecords from "./NFTUserSaleRecords";

const useStyles = makeStyles(() => {
  return {
    toolbarWrapper: {
      display: "grid",
      gridGap: "0 20px",
    },
    toolbar2: {
      gridArea: "1 / 1 / auto / auto",
    },
    toolbar3: {
      gridArea: "1 / 2 / auto / auto",
    },
    [customizeBreakPoints.down("1120")]: {
      toolbarWrapper: {
        gridGap: "10px 0",
      },
      toolbar2: {
        gridArea: "1 / 1 / auto / auto",
      },
      toolbar3: {
        gridArea: "2 / 1 / auto / auto",
      },
    },
  };
});

export type MarketComponent = React.FC<{
  searchValue: string;
  sortBy: string | undefined | null;
  canisterId?: string;
}>;

export type MarketPageConfig = {
  label: string;
  key: string;
  path: string;
  component: MarketComponent;
};

export const Pages: MarketPageConfig[] = [
  { label: t`On Sale`, key: "on-sale", path: "/marketplace/NFT", component: NFTMarketplace },
  { label: t`Activity`, key: "sales", path: "/marketplace/NFT/sales", component: NFTMarketSaleRecords },
  {
    label: t`Your Transactions`,
    key: "your-sales",
    path: "/marketplace/NFT/sales/user",
    component: NFTUserSaleRecords,
  },
];

const SortBy = [
  { label: t`Recently Listed`, value: "time" },
  { label: t`Price: Low to High`, value: "price" },
  { label: t`Price: High to Low`, value: "price-desc" },
  { label: t`Oldest`, value: "time-desc" },
];

export interface MarketWrapperProps {
  children: React.ReactNode;
  onSearchValueChange?: (value: string) => void;
  onSortByChange?: (sortBy: string) => void;
  onPageChange: (page: MarketPageConfig) => void;
  defaultSortBy: string | null | undefined;
  title: React.ReactNode;
}

export default function MarketWrapper({
  children,
  onSearchValueChange,
  onSortByChange,
  onPageChange,
  defaultSortBy = "time",
  title,
}: MarketWrapperProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchDown1120 = useMediaQuery(customizeBreakPoints.down("1120"));

  const [sortBy, setSortBy] = useState<string | null>("time");
  const [path, setPath] = useState<string>("/marketplace/NFT");

  useEffect(() => {
    setSortBy(defaultSortBy);
  }, [defaultSortBy, setSortBy]);

  const { canisterId } = useParsedQueryString() as { canisterId: string };

  const isOnSale = path === "/marketplace/NFT";

  const handleSearch = debounce(({ target: { value } }: any) => {
    if (onSearchValueChange) onSearchValueChange(value);
  }, 800);

  const handleLoadPage = (page: MarketPageConfig) => {
    setPath(page.path);
    onPageChange(page);
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    if (onSortByChange) onSortByChange(sort);
  };

  return (
    <Wrapper>
      {/* <Box>{!!canisterId ? <CollectionInfo canisterId={canisterId} /> : <MarketCarousel />}</Box> */}
      <Box>{title}</Box>

      <Box mt={canisterId ? (matchDown1120 ? "40px" : "97px") : matchDown1120 ? "40px" : "20px"}>
        <MainCard>
          <Grid container flexDirection={matchDown1120 ? "column" : "row"}>
            <Grid item xs>
              <Box
                sx={{
                  display: "grid",
                  gridGap: "0 40px",
                  gridTemplateColumns: "fit-content(200px) fit-content(200px) fit-content(200px)",
                  "& .MuiTypography-root": {
                    cursor: "pointer",
                  },
                }}
              >
                {Pages.map((page) => (
                  <Typography
                    key={page.key}
                    variant={matchDownSM ? "h5" : "h3"}
                    color={path === page.path ? "text.primary" : ""}
                    onClick={() => handleLoadPage(page)}
                  >
                    {page.label}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid
              item
              sx={{
                marginTop: matchDown1120 ? "10px" : "0",
              }}
            >
              {isOnSale ? (
                <Box className={classes.toolbarWrapper}>
                  <Box className={classes.toolbar2}>
                    <TextField
                      sx={{
                        width: "320px",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      size={matchDownSM ? "small" : "small"}
                      placeholder={t`Search NFTs by name and accounts`}
                      onChange={handleSearch}
                    />
                  </Box>

                  <Box className={classes.toolbar3}>
                    <Box
                      sx={{
                        height: "40px",
                      }}
                    >
                      <FilledTextField
                        fullHeight
                        alignCenter
                        select
                        placeholder={t`Sort By`}
                        required
                        value={sortBy}
                        onChange={(value) => handleSortByChange(value)}
                        menus={SortBy}
                        maxWidth={200}
                        width={200}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : null}
            </Grid>
          </Grid>
          <Box mt="22px">{children}</Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
