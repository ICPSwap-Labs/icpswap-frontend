import { Box, Typography, useTheme } from "@mui/material";
import { useListDeployedSNSs, useSwapSaleParameters } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useEffect, useMemo } from "react";
import { LoadingRow } from "components/index";
import type { SnsTokensInfo } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import AvatarImage from "components/Image/Avatar";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";
import { Tabs } from "components/sns/Tab";
import { SnsSwapLifecycle } from "@icpswap/constants";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";

interface LaunchpadProps {
  sns: SnsTokensInfo;
}

function Launchpad({ sns }: LaunchpadProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const { swap_id, root_id } = useMemo(() => {
    return {
      swap_id: sns.canister_ids.swap_canister_id,
      root_id: sns.canister_ids.root_canister_id,
    };
  }, [sns]);

  const { result: saleParameters } = useSwapSaleParameters(swap_id);

  const deadline = useMemo(() => {
    if (!saleParameters) return undefined;
    return saleParameters.swap_due_timestamp_seconds * BigInt(1000);
  }, [saleParameters]);

  return (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        "@media(max-width: 640px)": {
          padding: "10px",
        },
      }}
      onClick={() => history.push(`/sns/launch/${root_id}`)}
    >
      <Box sx={{ display: "flex", gap: "0 10px" }}>
        <AvatarImage src={sns.meta.logo} />
        <Typography color="text.primary" fontSize="18px" fontWeight={500}>
          {sns.meta.name}
        </Typography>
      </Box>

      <Typography
        sx={{
          margin: "20px 0 0 0",
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {sns.meta.description}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px 0 0 0" }}>
        <Typography>{sns.lifecycle.lifecycle === SnsSwapLifecycle.Committed ? t`Status` : t`Deadline`}</Typography>
        <Typography color="text.primary">
          {sns.lifecycle.lifecycle === SnsSwapLifecycle.Committed
            ? t`Complete`
            : deadline !== undefined
            ? dayjs(Number(deadline)).format("YYYY-MM-DD HH:mm:ss")
            : "--"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function LaunchpadList() {
  const { result: listedSNS } = useListDeployedSNSs();
  const { result: allSnsTokensInfo, loading } = useFetchSnsAllTokensInfo();

  const openedLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((e) => e.lifecycle.lifecycle === SnsSwapLifecycle.Open);
  }, [allSnsTokensInfo]);

  const completedLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((e) => e.lifecycle.lifecycle === SnsSwapLifecycle.Committed);
  }, [allSnsTokensInfo]);

  const upcomingLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((e) => e.lifecycle.lifecycle === SnsSwapLifecycle.Pending);
  }, [allSnsTokensInfo]);

  const updateTokenStandard = useUpdateTokenStandard();

  useEffect(() => {
    if (listedSNS) {
      listedSNS.instances.forEach((e) => {
        const leger_id = e.ledger_canister_id[0]?.toString();
        if (leger_id) {
          updateTokenStandard({ canisterId: leger_id, standard: TOKEN_STANDARD.ICRC1 });
        }
      });
    }
  }, [listedSNS]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: "1400px", width: "100%" }}>
        <Tabs />

        <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "10px 0 20px 0" }} color="text.primary">
          <Trans>Current Launches</Trans>
        </Typography>

        {!loading ? (
          openedLaunches && openedLaunches?.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "1fr 1fr 1fr",
                "@media (max-width:1088px)": {
                  gridTemplateColumns: "1fr 1fr",
                },
                "@media (max-width:640px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              {openedLaunches?.map((sns) => <Launchpad key={sns.canister_ids.root_canister_id} sns={sns} />)}
            </Box>
          ) : (
            <Typography>No Launches</Typography>
          )
        ) : (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        )}

        <Box sx={{ margin: "30px 0 0 0" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "0 0 20px 0" }} color="text.primary">
            <Trans>Upcoming Launches</Trans>
          </Typography>

          {!loading ? (
            upcomingLaunches && upcomingLaunches.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  "@media (max-width:1088px)": {
                    gridTemplateColumns: "1fr 1fr",
                  },
                  "@media (max-width:640px)": {
                    gridTemplateColumns: "1fr",
                  },
                }}
              >
                {upcomingLaunches?.map((sns) => <Launchpad key={sns.canister_ids.root_canister_id} sns={sns} />)}
              </Box>
            ) : (
              <Typography>No Upcoming Launches</Typography>
            )
          ) : (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          )}
        </Box>

        <Box sx={{ margin: "30px 0 0 0" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "0 0 20px 0" }} color="text.primary">
            <Trans>Launched</Trans>
          </Typography>

          {!loading ? (
            <Box
              sx={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "1fr 1fr 1fr",
                "@media (max-width:1088px)": {
                  gridTemplateColumns: "1fr 1fr",
                },
                "@media (max-width:640px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              {completedLaunches?.map((sns) => <Launchpad key={sns.canister_ids.root_canister_id} sns={sns} />)}
            </Box>
          ) : (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          )}
        </Box>
      </Box>
    </Box>
  );
}
