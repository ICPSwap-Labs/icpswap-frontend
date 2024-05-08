import { Typography, Box } from "@mui/material";
import { Wrapper, Breadcrumbs, TabPanel, SwapTooltip } from "components/index";
import { Trans } from "@lingui/macro";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { isMobile } from "react-device-detect";

import { ReclaimWithPair } from "./Pair";
import { ReclaimWithToken } from "./Token";
import { ReclaimAll } from "./All";

const Tabs = [
  {
    key: "pair",
    path: "/swap/reclaim?type=pair",
    value: "Trading Pair",
  },
  {
    key: "token",
    path: "/swap/reclaim?type=token",
    value: "Token",
  },
  {
    key: "all",
    path: "/swap/reclaim?type=all",
    value: "All",
  },
];

export default function SwapReclaim() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.search === "") {
      history.push("/swap/reclaim?type=pair");
    }
  }, [location, history]);

  return (
    <Wrapper>
      <Box sx={{ margin: "10px 0 0 0" }}>
        <Breadcrumbs
          prevLink="/swap"
          prevLabel={<Trans>Swap</Trans>}
          currentLabel={<Trans>Reclaim Your Tokens</Trans>}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
              <Trans>Reclaim Your Tokens</Trans>
            </Typography>

            {isMobile ? (
              <SwapTooltip
                maxWidth="calc(100% - 60px)"
                tips={
                  <>
                    <Typography color="#111936" sx={{ fontSize: "12px", lineHeight: "18px" }}>
                      <Trans>
                        For your funds' safety on ICPSwap and to make it more convenient for you to reclaim your tokens,
                        we've implemented the 'Reclaim Your Tokens feature. You can use this feature in case of issues
                        during swaps, liquidity withdrawals/additions, fee claims, or transaction failures due to
                        significant slippage. It allows you to retrieve and reclaim your tokens when issues occur!
                      </Trans>
                    </Typography>

                    <Typography sx={{ margin: "20px 0 0 0", color: "#111936", fontSize: "12px", lineHeight: "18px" }}>
                      <Trans>
                        When might issues occur: Such as network latency or stutter, page refreshing during the Swap,
                        excessive slippage, significant token price fluctuations, and so on.
                      </Trans>
                    </Typography>
                  </>
                }
              />
            ) : null}
          </Box>

          {!isMobile ? (
            <>
              <Typography sx={{ margin: "10px 0 0 0" }}>
                <Trans>
                  For your funds' safety on ICPSwap and to make it more convenient for you to reclaim your tokens, we've
                  implemented the 'Reclaim Your Tokens feature. You can use this feature in case of issues during swaps,
                  liquidity withdrawals/additions, fee claims, or transaction failures due to significant slippage. It
                  allows you to retrieve and reclaim your tokens when issues occur!
                </Trans>
              </Typography>

              <Typography sx={{ margin: "20px 0 0 0" }}>
                <Trans>
                  When might issues occur: Such as network latency or stutter, page refreshing during the Swap,
                  excessive slippage, significant token price fluctuations, and so on.
                </Trans>
              </Typography>
            </>
          ) : null}

          <Box
            sx={{
              margin: "44px 0 0 0",
              "@media(max-width: 640px)": {
                margin: "24px 0 0 0",
              },
            }}
          >
            <TabPanel tabs={Tabs} fontNormal fullWidth activeWithSearch />
          </Box>

          {location.search.includes("pair") ? <ReclaimWithPair /> : null}
          {location.search.includes("token") ? <ReclaimWithToken /> : null}
          {location.search.includes("all") ? <ReclaimAll /> : null}
        </Box>
      </Box>
    </Wrapper>
  );
}
