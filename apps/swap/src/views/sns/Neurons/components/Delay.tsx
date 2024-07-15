import { useMemo, useState } from "react";
import { Button, Typography, Box, useTheme } from "@mui/material";
import {
  parseTokenAmount,
  toHexString,
  toSignificantWithGroupSeparator,
  secondsToDays,
  daysToSeconds,
} from "@icpswap/utils";
import { increaseNeuronDelay } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import CircularProgress from "@mui/material/CircularProgress";
import type { NervousSystemParameters, Neuron } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { Modal, NumberFilledTextField } from "components/index";
import { secondsToDissolveDelayDuration, getSnsDelayTimeInSeconds, neuronFormat } from "utils/sns/index";
import { MaxButton, MinButton } from "components/Button";
import { Theme } from "@mui/material/styles";

export interface SetDissolveDelayProps {
  open: boolean;
  onClose: () => void;
  onSetSuccess?: () => void;
  token: TokenInfo | undefined;
  neuron_stake: bigint;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
  neuron: Neuron | undefined;
  disabled?: boolean;
}

export function SetDissolveDelay({
  onSetSuccess,
  neuron_stake,
  token,
  governance_id,
  neuron_id,
  neuronSystemParameters,
  neuron,
  disabled,
}: SetDissolveDelayProps) {
  const theme = useTheme() as Theme;
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [day, setDay] = useState<string | undefined>(undefined);

  const {
    neuron_minimum_dissolve_seconds,
    neuron_max_dissolve_seconds,
    neuron_max_dissolve_delay_bonus_percentage,
    aging_since_timestamp_seconds,
    neuron_max_age_bonus,
    neuron_max_age_percentage,
    staked_maturity_e8s_equivalent,
  } = useMemo(() => {
    if (!neuronSystemParameters || !neuron) return {};

    const formatted_neuron = neuronFormat(neuron);

    return {
      neuron_minimum_stake: neuronSystemParameters.neuron_minimum_stake_e8s[0],
      neuron_minimum_dissolve_seconds: neuronSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0],
      neuron_max_dissolve_seconds: neuronSystemParameters.max_dissolve_delay_seconds[0],
      neuron_max_dissolve_delay_bonus_percentage: neuronSystemParameters.max_dissolve_delay_bonus_percentage[0],
      neuron_max_age_bonus: neuronSystemParameters.max_neuron_age_for_age_bonus[0],
      neuron_max_age_percentage: neuronSystemParameters.max_age_bonus_percentage[0],

      aging_since_timestamp_seconds: neuron.aging_since_timestamp_seconds,
      staked_maturity_e8s_equivalent: neuron.staked_maturity_e8s_equivalent[0] || BigInt(0),
      dissolveDelay: formatted_neuron.dissolve_delay,
      whenDissolvedSeconds: formatted_neuron.when_dissolved_timestamp_seconds,
    };
  }, [neuronSystemParameters]);

  const currentDissolveDelaySeconds = useMemo(() => {
    if (!neuron) return undefined;
    return getSnsDelayTimeInSeconds(neuron) ?? 0n;
  }, [neuron]);

  const handleSubmit = async () => {
    if (loading || !day || !token || !governance_id || !neuron_id || currentDissolveDelaySeconds === undefined) return;

    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await increaseNeuronDelay(
      governance_id,
      neuron_id,
      BigInt(daysToSeconds(Number(day))) - currentDissolveDelaySeconds,
    );

    const result = data ? data.command[0] : undefined;
    const manage_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!manage_neuron_error) {
        openTip(t`Set dissolve delay successfully`, TIP_SUCCESS);
        if (onSetSuccess) onSetSuccess();
      } else {
        openTip(manage_neuron_error.error_message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to set dissolve delay`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleMax = () => {
    if (!neuron_max_dissolve_seconds) return;
    setDay(secondsToDays(Number(neuron_max_dissolve_seconds)).toString());
  };

  const handleMin = () => {
    if (!neuron) return;
    const day = secondsToDays(Math.max(Number(neuron_minimum_dissolve_seconds), Number(currentDissolveDelaySeconds)));
    setDay((day + 1).toString());
  };

  const votingPower = useMemo(() => {
    if (
      token === undefined ||
      day === undefined ||
      !neuron ||
      !neuronSystemParameters ||
      !neuron_minimum_dissolve_seconds ||
      !neuron_max_dissolve_seconds ||
      !neuron_max_dissolve_delay_bonus_percentage ||
      neuron_max_age_bonus === undefined ||
      neuron_max_age_percentage === undefined
    )
      return undefined;

    const newDelayInSeconds = daysToSeconds(Number(day));

    if (newDelayInSeconds === 0 || new BigNumber(newDelayInSeconds).lt(neuron_minimum_dissolve_seconds.toString())) {
      return 0;
    }

    const dissolveDelayBonus = new BigNumber(newDelayInSeconds)
      .div(neuron_max_dissolve_seconds.toString())
      .times(neuron_max_dissolve_delay_bonus_percentage.toString())
      .div(100)
      .plus(1);

    const now = Math.ceil(new Date().getTime() / 1000);

    let aging = BigInt(parseInt(new BigNumber(now).minus(aging_since_timestamp_seconds.toString()).toString()));

    const dissolveState = neuron.dissolve_state[0];

    if (dissolveState) {
      const type = Object.keys(dissolveState)[0];
      if (type === "WhenDissolvedTimestampSeconds") {
        aging = BigInt(0);
      }
    }

    const ageBonus = new BigNumber(aging.toString())
      .div(neuron_max_age_bonus.toString())
      .times(neuron_max_age_percentage.toString())
      .div(100)
      .plus(1);

    const balance = new BigNumber(neuron_stake.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** token.decimals)
      .toString(10);

    return new BigNumber(balance).times(dissolveDelayBonus).times(ageBonus).decimalPlaces(2, 1).toString(10);
  }, [
    day,
    token,
    staked_maturity_e8s_equivalent,
    neuronSystemParameters,
    neuron,
    neuron_minimum_dissolve_seconds,
    neuron_max_dissolve_delay_bonus_percentage,
    neuron_max_age_bonus,
    neuron_max_age_percentage,
    aging_since_timestamp_seconds,
  ]);

  const votingPowerPercentage = useMemo(() => {
    if (neuron_max_dissolve_seconds === undefined || day === undefined) return undefined;

    const maxDelay = Number(neuron_max_dissolve_seconds);

    const val = (daysToSeconds(Number(day)) / maxDelay) * 100;

    return val > 100 ? "100%" : `${val.toFixed(2)}%`;
  }, [day, neuron_max_dissolve_seconds]);

  let error: string | undefined;

  if (!day) error = t`Enter the dissolve delay`;

  if (token === undefined) error = t`Some unknown error happened`;
  if (day && Number(day) === 0) error = t`The new dissolve delay must be greater than the current value`;
  if (
    day &&
    currentDissolveDelaySeconds &&
    new BigNumber(daysToSeconds(Number(day))).isLessThan(currentDissolveDelaySeconds.toString())
  )
    error = t`Can't set a smaller delay than the current dissolve delay.`;
  if (
    day &&
    neuron_max_dissolve_seconds &&
    new BigNumber(daysToSeconds(Number(day))).isGreaterThan(neuron_max_dissolve_seconds.toString())
  )
    error = t`Dissolve delay exceeds the maximum allowed delay`;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={disabled}>
        <Trans>Delay</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Set Dissolve Delay`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px 0" }}>
          <Box>
            <Typography color="text.primary">Neuron ID</Typography>
            <Typography sx={{ fontSize: "12px", padding: "5px" }}>
              {neuron_id ? toHexString(neuron_id) : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.primary">Balance</Typography>
            <Typography sx={{ fontSize: "12px", padding: "5px" }}>
              {neuron_stake && token
                ? toSignificantWithGroupSeparator(parseTokenAmount(neuron_stake, token.decimals).toString(), 6)
                : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.primary">
              <Trans>Dissolve Delay</Trans>
            </Typography>
            <Typography sx={{ padding: "5px", fontSize: "12px", lineHeight: "16px" }}>
              <Trans>
                Dissolve delay is the minimum amount of time you have to wait for the neuron to unlock, and ICS to be
                available again. Note, that dissolve delay only decreases when the neuron is in a dissolving state.
                Voting power is given to neurons with a dissolve delay of at least&nbsp;
                {neuron_minimum_dissolve_seconds
                  ? secondsToDissolveDelayDuration(neuron_minimum_dissolve_seconds)
                  : "--"}
                .
              </Trans>
            </Typography>
          </Box>

          <Typography color="text.primary">
            <Trans>Dissolve Delay (in days)</Trans>
          </Typography>

          <Box sx={{ padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 5px 5px 0" }}>
              <MinButton onClick={handleMin} />
              <MaxButton onClick={handleMax} />
            </Box>

            <NumberFilledTextField
              placeholder={t`Enter the dissolve delay`}
              value={day}
              onChange={(value: string) => setDay(value)}
              fullWidth
              numericProps={{
                allowNegative: false,
                decimalScale: 8,
              }}
              autoComplete="off"
            />
          </Box>

          {day &&
          neuron_minimum_dissolve_seconds &&
          new BigNumber(day).isLessThan(secondsToDays(Number(neuron_minimum_dissolve_seconds))) ? (
            <Box>
              <Typography sx={{ color: theme.palette.warning.dark }}>
                <Trans>The neuron will not have voting power unless the dissolve delay is increased.</Trans>
              </Typography>
            </Box>
          ) : null}

          <Box sx={{ padding: "0 5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "8px",
                borderRadius: "8px",
                display: "flex",
                background: theme.palette.background.level1,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  background: theme.colors.secondaryMain,
                  width: votingPowerPercentage,
                  height: "100%",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-around", margin: "12px 0 0 0" }}>
              <Box>
                <Typography>{votingPower}</Typography>
                <Typography>
                  <Trans>Voting Power</Trans>
                </Typography>
              </Box>
              <Box>
                <Typography>{day}</Typography>
                <Typography>
                  <Trans>Dissolve Delay</Trans>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !!error}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
          >
            {error || <Trans>Confirm</Trans>}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
