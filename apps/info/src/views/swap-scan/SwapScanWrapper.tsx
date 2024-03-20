import { ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, Wrapper, FilledTextField } from "ui-component/index";
import { GridAutoRows } from "ui-component/Grid/index";
import { isValidPrincipal } from "@icpswap/utils";
import isFunction from "lodash/isFunction";
import useParsedQueryString from "hooks/useParsedQueryString";
import { SwapScanTabPanels } from "./components/TabPanels";

enum TabPanelValue {
  TRANSACTIONS = "transactions",
  POSITIONS = "positions",
  RECLAIM = "reclaims",
  VALUATION = "valuation",
}

export interface SwapScanWrapperProps {
  children: ReactNode;
}

export interface ScanChildrenProps {
  address: string | undefined;
}

export default function SwapScan({ children }: SwapScanWrapperProps) {
  const location = useLocation();

  const [search, setSearch] = useState<null | string>(null);

  const { principal } = useParsedQueryString() as { principal: string };

  useEffect(() => {
    if (principal && isValidPrincipal(principal)) {
      setSearch(principal);
    }
  }, [principal]);

  const address = useMemo(() => {
    if (!search) return undefined;
    if (!isValidPrincipal(search)) return undefined;
    return search;
  }, [search]);

  const activeTab = useMemo(() => {
    const arr = location.pathname.split("/");
    return arr[arr.length - 1] as TabPanelValue;
  }, [location]);

  return (
    <Wrapper>
      <MainCard>
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
          <Trans>Swap Scan</Trans>
        </Typography>

        <Box
          sx={{
            display: "flex",
            margin: "30px 0 0 0",
            alignItems: "center",
            justifyContent: "space-between",
            "@media(max-width: 640px)": {
              margin: "20px 0 0 0",
              flexDirection: "column",
              gap: "20px 0",
              alignItems: "flex-start",
              justifyContent: "center",
            },
          }}
        >
          <SwapScanTabPanels />

          <Box
            sx={{
              width: "343px",
              height: "40px",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
          >
            <FilledTextField
              width="100%"
              fullHeight
              value={search}
              textFiledProps={{
                placeholder: `Search the principal for ${
                  activeTab === TabPanelValue.TRANSACTIONS
                    ? "swap transactions"
                    : activeTab === TabPanelValue.POSITIONS
                    ? "swap positions"
                    : activeTab === TabPanelValue.RECLAIM
                    ? "reclaims"
                    : "valuation"
                }`,
              }}
              onChange={(value: string) => setSearch(value)}
            />
          </Box>
        </Box>

        <GridAutoRows gap="20px">{isFunction(children) ? children({ address }) : children}</GridAutoRows>
      </MainCard>
    </Wrapper>
  );
}
