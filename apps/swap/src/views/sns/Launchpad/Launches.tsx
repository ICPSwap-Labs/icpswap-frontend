import { Box, Typography, useTheme } from "components/Mui";
import { useSwapSaleParameters } from "@icpswap/hooks";
import { useMemo } from "react";
import { Flex, LoadingRow, Wrapper } from "components/index";
import type { NnsTokenInfo } from "@icpswap/types";
import AvatarImage from "components/Image/Avatar";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { Tabs } from "components/sns/Tab";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { useTranslation } from "react-i18next";
import { isNnsAdopted, isNnsCommitted, isNnsOpen, isNnsPending, nnsTokenLogo } from "utils/sns/utils";

interface LaunchpadProps {
  sns: NnsTokenInfo;
}

function Launchpad({ sns }: LaunchpadProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();

  const { swap_id, root_id } = useMemo(() => {
    return {
      swap_id: sns.list_sns_canisters.swap,
      root_id: sns.list_sns_canisters.root,
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
      <Flex gap="0 10px">
        <AvatarImage src={nnsTokenLogo(sns)} />
        <Typography color="text.primary" fontSize="18px" fontWeight={500}>
          {sns.meta.name}
        </Typography>
      </Flex>

      <Typography
        sx={{
          margin: "20px 0 0 0",
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "18px",
        }}
      >
        {sns.meta.description}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px 0 0 0" }}>
        <Typography>{isNnsCommitted(sns) ? t`Status` : t("common.dead.line")}</Typography>
        <Typography color="text.primary">
          {isNnsCommitted(sns)
            ? t("common.complete")
            : deadline !== undefined
            ? dayjs(Number(deadline)).format("YYYY-MM-DD HH:mm:ss")
            : "--"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function LaunchpadList() {
  const { t } = useTranslation();
  const { result: __allSnsTokensInfo, loading } = useFetchSnsAllTokensInfo();

  // Only show the launches after ICPSwap Token
  const allSnsTokensInfo = useMemo(() => {
    if (!__allSnsTokensInfo) return undefined;
    return __allSnsTokensInfo.filter((e) => e.index >= 27);
  }, [__allSnsTokensInfo]);

  const openedLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((e) => isNnsOpen(e));
  }, [allSnsTokensInfo]);

  const completedLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((e) => isNnsCommitted(e));
  }, [allSnsTokensInfo]);

  const upcomingLaunches = useMemo(() => {
    if (!allSnsTokensInfo) return undefined;
    return allSnsTokensInfo.filter((nns) => isNnsPending(nns) || isNnsAdopted(nns));
  }, [allSnsTokensInfo]);

  return (
    <Wrapper>
      <Tabs />

      <Typography sx={{ fontSize: "22px", fontWeight: 500, margin: "10px 0 20px 0" }} color="text.primary">
        {t("nns.launches")}
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
            {openedLaunches?.map((sns) => <Launchpad key={sns.list_sns_canisters.root} sns={sns} />)}
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
          {t("nns.upcoming.launches")}
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
              {upcomingLaunches?.map((sns) => <Launchpad key={sns.list_sns_canisters.root} sns={sns} />)}
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
          {t("nns.launch.launched")}
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
            {completedLaunches?.map((sns) => <Launchpad key={sns.list_sns_canisters.root} sns={sns} />)}
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
    </Wrapper>
  );
}
