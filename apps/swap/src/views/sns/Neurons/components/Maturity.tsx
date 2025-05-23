import { Box, Typography, Checkbox } from "components/Mui";
import { autoStakeMaturity, disburseNeuronMaturity } from "@icpswap/hooks";
import { Flex, ConfirmModal } from "@icpswap/ui";
import { Neuron } from "@icpswap/types";
import { useMemo, useState } from "react";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { BigNumber, formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { secondsToDuration } from "@dfinity/utils";
import { SnsNeuronPermissionType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";
import { useUSDPrice } from "hooks/useUSDPrice";

import { DisburseMaturity } from "./DisburseMaturity";
import { StakeMaturity } from "./StakeMaturity";

export interface MaturityProps {
  neuron: Neuron;
  token: Token | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  onMaturitySuccess?: () => void;
  permissions: number[];
}

export function Maturity({ neuron, token, governance_id, neuron_id, onMaturitySuccess, permissions }: MaturityProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const tokenUSDPrice = useUSDPrice(token);

  const { auto_stake_maturity, staked_maturity, available_maturity } = useMemo(() => {
    return {
      auto_stake_maturity: neuron.auto_stake_maturity[0],
      staked_maturity: neuron.staked_maturity_e8s_equivalent[0],
      available_maturity: neuron.maturity_e8s_equivalent,
    };
  }, [neuron]);

  const handleToggleMaturity = () => {
    if (!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_STAKE_MATURITY)) return;
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setOpen(false);
    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await autoStakeMaturity(governance_id, neuron_id, !auto_stake_maturity);

    const result = data ? data.command[0] : undefined;
    const stop_dissolving_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!stop_dissolving_neuron_error) {
        openTip(t`Set automatically stake new maturity successfully`, TIP_SUCCESS);
        if (onMaturitySuccess) onMaturitySuccess();
      } else {
        const message = stop_dissolving_neuron_error.error_message;
        openTip(message === "" ? t("nns.failed.set.automatically.maturity") : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t("nns.failed.set.automatically.maturity"), TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleDisburseMaturity = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setDisburseOpen(false);
    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await disburseNeuronMaturity(governance_id, neuron_id);

    const result = data ? data.command[0] : undefined;
    const neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!neuron_error) {
        openTip(t("nns.disburse.success"), TIP_SUCCESS);
        setDisburseOpen(false);
        setLoading(false);
      } else {
        const message = neuron_error.error_message;
        openTip(message === "" ? t`Failed to disburse maturity` : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to disburse maturity`, TIP_ERROR);
    }

    closeFullscreenLoading();
  };

  return (
    <Box sx={{ margin: "20px 0 0 0" }}>
      <Flex align="center" justify="space-between">
        <Typography color="text.primary" fontSize="16px" fontWeight={600}>
          {t("nns.maturity")}
        </Typography>
      </Flex>
      <Typography fontSize="12px" sx={{ margin: "5px 0 0 0" }}>
        {t("nns.earn.rewards.description")}
      </Typography>

      <Flex gap="0 5px" justify="space-between" align="center" margin="10px 0 0 0">
        <Typography color="text.primary" fontWeight={500}>
          Staked:&nbsp;
          {token && staked_maturity
            ? `${toSignificantWithGroupSeparator(parseTokenAmount(staked_maturity, token.decimals).toString())} ${
                token.symbol
              }`
            : "--"}
        </Typography>
      </Flex>

      <Flex margin="10px 0 0 0" gap="0 5px" justify="space-between" align="center">
        <Typography color="text.primary" fontWeight={500}>
          Available:&nbsp;
          {token
            ? `${toSignificantWithGroupSeparator(parseTokenAmount(available_maturity, token.decimals).toString())} ${
                token.symbol
              }`
            : "--"}
        </Typography>

        <Flex gap="0 5px" align="center">
          <StakeMaturity
            neuron={neuron}
            neuron_id={neuron_id}
            governance_id={governance_id}
            token={token}
            onStakeMaturitySuccess={onMaturitySuccess}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_STAKE_MATURITY)}
          />

          <DisburseMaturity
            neuron={neuron}
            neuron_id={neuron_id}
            governance_id={governance_id}
            onDisburseMaturitySuccess={onMaturitySuccess}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_DISBURSE_MATURITY)}
          />
        </Flex>
      </Flex>

      {neuron.disburse_maturity_in_progress.length > 0 ? (
        <Box sx={{ margin: "10px 0 0 0" }}>
          <Typography color="text.primary" fontWeight={500}>
            {t("nns.disbursing.countdown")}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px 0", margin: "10px 0 0 0" }}>
            {neuron.disburse_maturity_in_progress.map((e, index) => {
              const finalize_disbursement_timestamp_seconds = e.finalize_disbursement_timestamp_seconds[0];

              if (!finalize_disbursement_timestamp_seconds) return null;

              const seconds =
                finalize_disbursement_timestamp_seconds -
                BigInt(parseInt((new Date().getTime() / 1000).toString(), 10));

              const amount = token ? parseTokenAmount(e.amount_e8s, token.decimals).toString() : undefined;

              return token && amount ? (
                <Typography key={index} sx={{ fontSize: "12px" }}>
                  {amount}
                  {tokenUSDPrice
                    ? ` (${formatDollarAmount(new BigNumber(tokenUSDPrice).multipliedBy(amount).toString())})`
                    : ""}{" "}
                  {token.symbol} remaining {secondsToDuration({ seconds })}
                </Typography>
              ) : null;
            })}
          </Box>
        </Box>
      ) : null}

      <Box margin="15px 0 0 0" sx={{ cursor: "pointer", width: "fit-content" }} onClick={handleToggleMaturity}>
        <Flex gap="0 5px">
          <Checkbox
            checked={auto_stake_maturity}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_STAKE_MATURITY)}
          />
          <Typography>{t("nns.auto.stake.maturity")}</Typography>
        </Flex>
      </Box>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title={t`Maturity`}
        onConfirm={handleConfirm}
        text={
          auto_stake_maturity ? t("nns.maturity.automatically.confirm") : t("nns.maturity.stop.automatically.confirm")
        }
      />

      <ConfirmModal
        open={disburseOpen}
        onClose={() => setDisburseOpen(false)}
        title={t("nns.disburse.maturity")}
        onConfirm={handleDisburseMaturity}
        text={t`Are you sure you want to disburse this neuron?`}
      />
    </Box>
  );
}
