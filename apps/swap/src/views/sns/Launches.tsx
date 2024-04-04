import { Box, Typography, useTheme } from "@mui/material";
import { useSNSTokensRootIds, useListDeployedSNSs, useSwapSaleParameters } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useEffect, useMemo } from "react";
import { LoadingRow } from "components/index";
import type { TokenRoots, ListDeployedSnsesResponse } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import AvatarImage from "components/Image/Avatar";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";

interface LaunchpadProps {
  token_root: TokenRoots;
  listedSNS: ListDeployedSnsesResponse | undefined;
}

function Launchpad({ token_root, listedSNS }: LaunchpadProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const swap_id = useMemo(() => {
    if (!listedSNS) return undefined;

    const sns = listedSNS.instances.find((e) => {
      const root_id = e.root_canister_id[0];
      return root_id && root_id.toString() === token_root.root_canister_id;
    });

    return sns ? sns.swap_canister_id[0]?.toString() : undefined;
  }, [listedSNS, token_root]);

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
      onClick={() => history.push(`/sns/launch/${token_root.root_canister_id}`)}
    >
      <Box sx={{ display: "flex", gap: "0 10px" }}>
        <AvatarImage src={token_root.logo} />
        <Typography color="text.primary" fontSize="18px" fontWeight={500}>
          {token_root.name}
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
        {token_root.description}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px 0 0 0" }}>
        <Typography>
          {token_root.swap_lifecycle.lifecycle === "LIFECYCLE_COMMITTED" ? t`Status` : t`Deadline`}
        </Typography>
        <Typography color="text.primary">
          {token_root.swap_lifecycle.lifecycle === "LIFECYCLE_COMMITTED"
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
  const { result: snsTokens, loading } = useSNSTokensRootIds();
  const { result: listedSNS } = useListDeployedSNSs();

  const openedLaunches = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.swap_lifecycle.lifecycle === "LIFECYCLE_OPEN");
  }, [snsTokens]);

  const completedLaunches = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.swap_lifecycle.lifecycle === "LIFECYCLE_COMMITTED");
  }, [snsTokens]);

  const upcomingLaunches = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.swap_lifecycle.lifecycle === "LIFECYCLE_ADOPTED");
  }, [snsTokens]);

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
        <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "0 0 20px 0" }} color="text.primary">
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
              {openedLaunches?.map((e) => <Launchpad key={e.root_canister_id} token_root={e} listedSNS={listedSNS} />)}
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
                {upcomingLaunches?.map((e) => (
                  <Launchpad key={e.root_canister_id} token_root={e} listedSNS={listedSNS} />
                ))}
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
            <Trans>Launchpad</Trans>
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
              {completedLaunches?.map((e) => (
                <Launchpad key={e.root_canister_id} token_root={e} listedSNS={listedSNS} />
              ))}
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
