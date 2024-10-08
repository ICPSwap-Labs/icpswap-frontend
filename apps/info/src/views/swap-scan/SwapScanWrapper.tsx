import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, Wrapper, FilledTextField } from "ui-component/index";
import { GridAutoRows } from "@icpswap/ui";
import { isValidPrincipal, locationSearchReplace } from "@icpswap/utils";
import isFunction from "lodash/isFunction";
import { useParsedQueryString } from "@icpswap/hooks";
import { SwapScanTabPanels } from "./components/TabPanels";

enum TabPanelValue {
  TRANSACTIONS = "transactions",
  POSITIONS = "positions",
  RECLAIM = "pool-balances",
  VALUATION = "valuation",
}

export interface SwapScanWrapperProps {
  children: ReactNode | ((props: any) => JSX.Element);
}

export interface ScanChildrenProps {
  address: string | undefined;
}

export default function SwapScan({ children }: SwapScanWrapperProps) {
  const location = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState<null | string>(null);

  const { principal } = useParsedQueryString() as { principal: string | undefined };

  useEffect(() => {
    if (principal && isValidPrincipal(principal)) {
      setSearch(principal);
    } else {
      setSearch("");
    }
  }, [principal]);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (isValidPrincipal(value) || value === "") {
        const search = locationSearchReplace(location.search, "principal", value);
        history.push(`${location.pathname}${search}`);
      }
    },
    [history, location],
  );

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
                    ? "transactions"
                    : activeTab === TabPanelValue.POSITIONS
                    ? "positions"
                    : activeTab === TabPanelValue.RECLAIM
                    ? "users’ Pool Balances"
                    : "valuation"
                }`,
                sx: {
                  "& input": {
                    padding: "0",
                    "::-webkit-input-placeholder": {
                      fontSize: "12px",
                    },
                  },
                },
              }}
              onChange={handleSearchChange}
            />
          </Box>
        </Box>

        <GridAutoRows gap="20px">{isFunction(children) ? children({ address }) : children}</GridAutoRows>
      </MainCard>
    </Wrapper>
  );
}
