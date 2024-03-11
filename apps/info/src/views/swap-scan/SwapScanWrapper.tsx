import { ReactNode, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { MainCard, Wrapper, FilledTextField } from "ui-component/index";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { GridAutoRows } from "ui-component/Grid/index";
import { isValidPrincipal } from "@icpswap/utils";
import isFunction from "lodash/isFunction";
import useParsedQueryString from "hooks/useParsedQueryString";

const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: {
    fontSize: "18px",
    fontWeight: 500,
    color: theme.typography.secondary,
    cursor: "pointer",
    "&.active": {
      color: "#ffffff",
    },
    "@media(max-width: 640px)": {
      fontSize: "16px",
    },
  },
}));

enum TabPanelValue {
  TRANSACTIONS = "transactions",
  POSITIONS = "positions",
  RECLAIM = "reclaims",
}

const TabPanels = [
  { label: t`Transactions`, value: TabPanelValue.TRANSACTIONS, link: "/swap-scan/transactions" },
  { label: t`Positions`, value: TabPanelValue.POSITIONS, link: "/swap-scan/positions" },
  { label: t`Reclaim`, value: TabPanelValue.RECLAIM, link: "/swap-scan/reclaims" },
];

export interface SwapScanWrapperProps {
  children: ReactNode;
}

export interface ScanChildrenProps {
  address: string | undefined;
}

export default function SwapScan({ children }: SwapScanWrapperProps) {
  const classes = useStyles();
  const history = useHistory();
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
          <Box
            sx={{
              display: "flex",
              gap: "0 30px",
              "@media(max-width: 640px)": {
                gap: "0 15px",
              },
            }}
          >
            {TabPanels.map((ele) => (
              <Typography
                key={ele.value}
                className={`${classes.tabPanel}${activeTab === ele.value ? " active" : ""}`}
                onClick={() => {
                  history.push(ele.link);
                }}
              >
                {ele.label}
              </Typography>
            ))}
          </Box>

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
                    : "reclaims"
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
