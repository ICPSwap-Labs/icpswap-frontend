import { Typography, Box } from "components/Mui";
import { Wrapper, Breadcrumbs, TabPanel, Tooltip } from "components/index";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

import { ReclaimWithPair } from "./Pair";
import { ReclaimWithToken } from "./Token";
import { ReclaimAll } from "./All";

const Tabs = [
  {
    key: "pair",
    path: "/swap/withdraw?type=pair",
    value: "Swap Pairs",
  },
  {
    key: "token",
    path: "/swap/withdraw?type=token",
    value: "Tokens",
  },
  {
    key: "all",
    path: "/swap/withdraw?type=all",
    value: "All Pools",
  },
];

export default function SwapReclaim() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search === "") {
      navigate("/swap/withdraw?type=pair");
    }
  }, [location, navigate]);

  return (
    <Wrapper sx={{ padding: "16px 0" }}>
      <Breadcrumbs prevLink="/swap" prevLabel={t("common.swap")} currentLabel={t("swap.view.pool.balances")} />

      <Box sx={{ display: "flex", justifyContent: "center", margin: "40px 0 0 0" }}>
        <Box sx={{ width: "800px" }}>
          <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} color="text.primary">
              {t("swap.check.your.balances")}
            </Typography>

            {isMobile ? (
              <Tooltip
                maxWidth="calc(100% - 60px)"
                tips={
                  <>
                    <Typography color="#111936" sx={{ fontSize: "12px", lineHeight: "18px" }}>
                      {t("swap.reclaim.descriptions")}
                    </Typography>
                  </>
                }
              />
            ) : null}
          </Box>

          {!isMobile ? (
            <Typography sx={{ margin: "10px 0 0 0", lineHeight: "18px" }}>{t("swap.reclaim.descriptions")}</Typography>
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
