import { Box, Typography, useTheme } from "components/Mui";
import { useSNSSwapDerivedState, useSwapLifeCycle, useSNSBuyerState, useIpLocationCode } from "@icpswap/hooks";
import { useMemo, useState, useContext } from "react";
import { TextButton, AuthButton } from "components/index";
import type { SwapSaleParameters, SNSSwapInitArgs } from "@icpswap/types";
import dayjs from "dayjs";
import { BigNumber, parseTokenAmount, toSignificant } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { useAccountPrincipal, useConnector } from "store/auth/hooks";
import { SnsSwapLifecycle } from "@icpswap/constants";
import { Connector } from "constants/wallet";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

import { Participate } from "./Participate";
import { LaunchContext } from "./context";

export interface LaunchStatusProps {
  ledger_id: string | undefined;
  swap_id: string | undefined;
  token: Token | undefined;
  saleParameters: SwapSaleParameters | undefined;
  swapInitArgs: SNSSwapInitArgs | undefined;
}

const statusTextMapper: { [status: string]: string } = {
  [SnsSwapLifecycle.Unspecified]: i18n.t("common.unspecified"),
  [SnsSwapLifecycle.Pending]: `Upcoming swap`,
  [SnsSwapLifecycle.Open]: i18n.t("launch.accepting.participation"),
  [SnsSwapLifecycle.Committed]: `Completed`,
  [SnsSwapLifecycle.Aborted]: `Aborted`,
  [SnsSwapLifecycle.Adopted]: i18n.t("launch.staring.soon"),
};

export function LaunchStatus({ token, swap_id, swapInitArgs, saleParameters }: LaunchStatusProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const principal = useAccountPrincipal();
  const [participateOpen, setParticipateOpen] = useState(false);

  const { reload, setReload } = useContext(LaunchContext);

  const { result: swap_life_cycle_result } = useSwapLifeCycle(swap_id);
  const { result: swap_derived_state } = useSNSSwapDerivedState(swap_id, reload);
  const { result: buyer_state_result } = useSNSBuyerState(swap_id, principal?.toString(), reload);

  const bought_amount = useMemo(() => {
    if (!buyer_state_result) return undefined;
    const amount_e8s = buyer_state_result.buyer_state[0]?.icp[0]?.amount_e8s;
    return amount_e8s?.toString();
  }, [buyer_state_result]);

  const swap_life_cycle = useMemo(() => {
    if (!swap_life_cycle_result) return undefined;
    const life_cycle = swap_life_cycle_result.lifecycle[0];
    return life_cycle;
  }, [swap_life_cycle_result]);

  const restricted_countries = useMemo(() => {
    if (!swapInitArgs) return undefined;
    return swapInitArgs.restricted_countries[0]?.iso_codes?.join(",");
  }, [swapInitArgs]);

  const { max_neurons_fund_commitment } = useMemo(() => {
    if (!swapInitArgs) return { max_neurons_fund_commitment: undefined };

    const max_neurons_fund_commitment =
      swapInitArgs.neurons_fund_participation_constraints[0]?.max_neurons_fund_participation_icp_e8s[0]?.toString();

    return { max_neurons_fund_commitment };
  }, [swapInitArgs]);

  const { min_direct, max_direct, min_participant, max_participant } = useMemo(() => {
    if (!saleParameters) return { min_direct: undefined, max_direct: undefined };

    const max_direct = saleParameters.max_direct_participation_icp_e8s[0];
    const min_direct = saleParameters.min_direct_participation_icp_e8s[0];

    const min_participant = saleParameters.min_participant_icp_e8s;
    const max_participant = saleParameters.max_participant_icp_e8s;

    return { max_direct, min_direct, min_participant, max_participant };
  }, [saleParameters]);

  const { total_participants, direct_participation_icp, neurons_fund_icp, neurons_fund_percent, buyer_total_icp } =
    useMemo(() => {
      if (!swap_derived_state)
        return {
          total_participants: undefined,
          direct_participation_icp: undefined,
          neurons_fund_icp: undefined,
          neurons_fund_percent: undefined,
          buyer_total_icp: undefined,
        };

      const total_participants = swap_derived_state.direct_participant_count[0]?.toString();
      const direct_participation_icp = swap_derived_state.direct_participation_icp_e8s[0]?.toString();
      const neurons_fund_icp = swap_derived_state.neurons_fund_participation_icp_e8s[0]?.toString();
      const buyer_total_icp = swap_derived_state.buyer_total_icp_e8s[0]?.toString();

      return {
        total_participants,
        direct_participation_icp,
        neurons_fund_icp,
        buyer_total_icp,
        neurons_fund_percent:
          !neurons_fund_icp || !max_neurons_fund_commitment
            ? undefined
            : `${new BigNumber(neurons_fund_icp.toString())
                .dividedBy(max_neurons_fund_commitment.toString())
                .multipliedBy(100)
                .toFixed(2)}%`,
      };
    }, [swap_derived_state, max_neurons_fund_commitment]);

  const { direct_commitment_percent, min_direct_percent, fill_min_direct, fill_max_direct } = useMemo(() => {
    if (!swap_derived_state || !saleParameters)
      return {
        direct_commitment_percent: undefined,
        min_direct_percent: undefined,
        fill_min_direct: false,
        fill_max_direct: false,
      };

    const direct_participation_icp = swap_derived_state.direct_participation_icp_e8s[0]?.toString();
    const max_direct = saleParameters.max_direct_participation_icp_e8s[0];
    const min_direct = saleParameters.min_direct_participation_icp_e8s[0];

    if (!direct_participation_icp || !max_direct || !min_direct)
      return {
        direct_commitment_percent: undefined,
        min_direct_percent: undefined,
        fill_min_direct: false,
        fill_max_direct: false,
      };

    return {
      direct_commitment_percent: `${new BigNumber(direct_participation_icp.toString())
        .dividedBy(max_direct.toString())
        .multipliedBy(100)
        .toFixed(2)}%`,
      min_direct_percent: `${new BigNumber(min_direct.toString())
        .dividedBy(max_direct.toString())
        .multipliedBy(100)
        .toFixed(2)}%`,
      fill_min_direct: !new BigNumber(direct_participation_icp.toString()).isLessThan(min_direct.toString()),
      fill_max_direct: !new BigNumber(direct_participation_icp.toString()).isLessThan(max_direct.toString()),
    };
  }, [swap_derived_state, saleParameters]);

  const { result: location_code } = useIpLocationCode();
  const connector = useConnector();

  const handleParticipate = async () => {
    setParticipateOpen(true);
  };

  const handleParticipateSuccessfully = () => {
    setReload(reload + 1);
  };

  let error: string | undefined;

  if (!location_code || (location_code && restricted_countries && restricted_countries.includes(location_code)))
    error = t`Participation is not allowed in your region`;
  if (!connector || connector !== Connector.PLUG) error = t`Only Plug wallet can participate`;

  return (
    <Box
      sx={{
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "20px",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "15px 0",
        "@media(max-width: 980px)": {
          width: "100%",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="text.primary" fontSize="18px" fontWeight={500}>
          Status
        </Typography>

        {swap_life_cycle ? (
          <Box
            sx={{
              padding: "3px 10px",
              borderRadius: "12px",
              background:
                swap_life_cycle === SnsSwapLifecycle.Open ? theme.colors.successDark : theme.palette.background.level1,
            }}
          >
            <Typography color="text.primary">{swap_life_cycle ? statusTextMapper[swap_life_cycle] : "--"}</Typography>
          </Box>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{t("nns.launch.current.participants")}</Typography>
        <Typography color="text.primary" align="right" sx={{ wordBreak: "break-all" }}>
          {total_participants || "--"}
        </Typography>
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Box sx={{ width: "8px", height: "8px", background: theme.colors.secondaryMain, borderRadius: "50%" }} />
            <Typography>{t("nns.launch.direct.commitment")}</Typography>
          </Box>
          <Typography color="text.primary" align="right" sx={{ wordBreak: "break-all" }}>
            {direct_participation_icp
              ? `${toSignificant(parseTokenAmount(direct_participation_icp, ICP.decimals).toString(), 8, {
                  groupSeparator: ",",
                })} ${ICP.symbol}`
              : "--"}
          </Typography>
        </Box>

        <Box
          sx={{ borderRadius: "8px", background: "#ffffff", height: "8px", margin: "20px 0 0 0", position: "relative" }}
        >
          <Box
            sx={{
              background: theme.colors.secondaryMain,
              width: direct_commitment_percent || "0%",
              height: "8px",
              borderRadius: "8px",
            }}
          />

          <Box
            sx={{
              width: min_direct_percent ? "2px" : "0px",
              height: "18px",
              background: theme.colors.secondaryMain,
              position: "absolute",
              top: "50%",
              left: min_direct_percent || "0%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: `8px solid ${theme.colors.secondaryMain}`,
              top: "-10px",
              left: min_direct_percent || "0%",
              transform: "translate(-50%, -50%)",
              display: min_direct_percent ? "block" : "none",
            }}
          />
        </Box>

        <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography color={fill_min_direct ? theme.colors.secondaryMain : "textSecondary"}>
              {t("nns.launch.min.direct.commitment")}
            </Typography>
            <Typography
              sx={{ margin: "5px 0 0 0", color: fill_min_direct ? theme.colors.secondaryMain : "textSecondary" }}
            >
              {min_direct ? `${parseTokenAmount(min_direct, ICP.decimals).toFormat()} ${ICP.symbol}` : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography
              align="right"
              sx={{
                color: fill_max_direct ? theme.colors.secondaryMain : "textSecondary",
              }}
            >
              {t("nns.launch.max.direct.commitment")}
            </Typography>
            <Typography
              sx={{ margin: "5px 0 0 0", color: fill_max_direct ? theme.colors.secondaryMain : "textSecondary" }}
              align="right"
            >
              {max_direct ? `${parseTokenAmount(max_direct, ICP.decimals).toFormat()} ${ICP.symbol}` : "--"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Box sx={{ width: "8px", height: "8px", background: theme.colors.primaryMain, borderRadius: "50%" }} />
            <Typography>{t("nns.launch.fund.commitment")}</Typography>
          </Box>
          <Typography color="text.primary" align="right" sx={{ wordBreak: "break-all" }}>
            {neurons_fund_icp
              ? `${toSignificant(parseTokenAmount(neurons_fund_icp, ICP.decimals).toString(), 8, {
                  groupSeparator: ",",
                })} ${ICP.symbol}`
              : "--"}
          </Typography>
        </Box>

        <Typography sx={{ margin: "10px 0 0 0", fontSize: "12px" }}>
          The Neurons' Fund commitment increases based on direct participation. The exact amount is computed at the end
          of the swap.
          <TextButton
            sx={{ fontSize: "12px" }}
            link="https://internetcomputer.org/docs/current/developer-docs/daos/nns/neurons-fund"
          >
            Learn more.
          </TextButton>
        </Typography>

        <Box
          sx={{ borderRadius: "8px", background: "#ffffff", height: "8px", margin: "10px 0 0 0", position: "relative" }}
        >
          <Box
            sx={{
              background: theme.colors.primaryMain,
              width: neurons_fund_percent || "0px",
              height: "8px",
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography>{t("nns.launch.min.fund.commitment")}</Typography>
            <Typography sx={{ margin: "5px 0 0 0" }}>{`0 ${ICP.symbol}`}</Typography>
          </Box>
          <Box>
            <Typography align="right">{t("nns.launch.max.fund.commitment")}</Typography>
            <Typography sx={{ margin: "5px 0 0 0" }} align="right">
              {max_neurons_fund_commitment
                ? `${toSignificant(parseTokenAmount(max_neurons_fund_commitment, ICP.decimals).toString(), 8, {
                    groupSeparator: ",",
                  })} ${ICP.symbol}`
                : "--"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "10px 0 0 0", display: "flex", justifyContent: "space-between" }}>
        <Typography>{t("nns.launch.overall.commitment")}</Typography>

        <Typography color="text.primary">
          {buyer_total_icp
            ? `${toSignificant(parseTokenAmount(buyer_total_icp, ICP.decimals).toString(), 8, {
                groupSeparator: ",",
              })} ${ICP.symbol}`
            : "--"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{t("nns.launch.my.commitment")}</Typography>

        <Typography color="text.primary">
          {buyer_total_icp
            ? `${toSignificant(parseTokenAmount(bought_amount, ICP.decimals).toString(), 8, {
                groupSeparator: ",",
              })} ${ICP.symbol}`
            : "--"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{t("common.dead.line")}</Typography>

        <Typography color="text.primary">
          {buyer_total_icp
            ? saleParameters
              ? `${dayjs(Number(saleParameters.swap_due_timestamp_seconds * BigInt(1000))).format(
                  "YYYY-MM-DD HH:mm:ss",
                )}`
              : "--"
            : "--"}
        </Typography>
      </Box>

      {swap_life_cycle && swap_life_cycle === SnsSwapLifecycle.Open ? (
        <Box sx={{ margin: "20px 0 0 0" }}>
          <AuthButton variant="contained" onClick={handleParticipate} disabled={!!error || location_code === undefined}>
            {error ?? t("common.participate")}
          </AuthButton>
        </Box>
      ) : null}

      {participateOpen ? (
        <Participate
          open={participateOpen}
          onClose={() => setParticipateOpen(false)}
          token={token}
          swapInitArgs={swapInitArgs}
          swap_id={swap_id}
          min_participant={min_participant}
          max_participant={max_participant}
          onParticipateSuccessfully={handleParticipateSuccessfully}
        />
      ) : null}
    </Box>
  );
}
