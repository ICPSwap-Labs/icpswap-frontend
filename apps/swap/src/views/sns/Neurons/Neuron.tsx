import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import {
  useListDeployedSNSs,
  useSNSTokensRootIds,
  useNervousSystemParameters,
  useListNeurons,
  useNeuron,
} from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useMemo, useState } from "react";
import { LoadingRow, TabPanel, Copy, MainCard, AvatarImage, Flex } from "components/index";
import type { Neuron } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { useHistory, useParams } from "react-router-dom";
import { useAccountPrincipalString } from "store/auth/hooks";
import { neuronFormat, NeuronState, getDissolvingTimeInSeconds, getNervousVotingPower } from "utils/neuron";
import { parseTokenAmount, shorten, toSignificantWithGroupSeparator, hexToBytes } from "@icpswap/utils";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { Lock, Unlock, Clock } from "react-feather";
import { useTokenInfo } from "hooks/token";
import { secondsToDuration } from "@dfinity/utils";

interface NeuronProps {
  neuron: Neuron;
  ledger_id: string | undefined;
  root_id: string | null;
}

function NeuronItem({ neuron, ledger_id, root_id }: NeuronProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();
  const { result: tokenInfo } = useTokenInfo(ledger_id);

  const formatted_neuron = neuronFormat(neuron);

  const seconds = getDissolvingTimeInSeconds(neuron) ?? formatted_neuron.dissolve_delay;

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
      onClick={() => {
        if (root_id) {
          history.push(`/sns/neurons/${root_id}?neuron=${formatted_neuron.id}`);
        }
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex gap="0 5px" align="center">
          <Typography color="text.primary">{formatted_neuron.id ? shorten(formatted_neuron.id, 6) : "--"}</Typography>
          {formatted_neuron.id ? (
            <Copy content={formatted_neuron.id}>
              <CopyIcon color={theme.colors.darkSecondaryMain} />
            </Copy>
          ) : null}
        </Flex>

        <Flex gap="0 8px" align="center">
          {formatted_neuron.dissolve_state === NeuronState.Locked ? <Lock size="16px" /> : null}
          {formatted_neuron.dissolve_state === NeuronState.Dissolving ? <Clock size="16px" /> : null}
          {formatted_neuron.dissolve_state === NeuronState.Dissolved ? <Unlock size="16px" /> : null}
          <Typography>{formatted_neuron.dissolve_state_text}</Typography>
        </Flex>
      </Flex>

      <Box sx={{ display: "flex", margin: "20px 0 0 0" }}>
        <Typography color="text.primary" fontWeight={500} fontSize="24px">
          {tokenInfo
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(formatted_neuron.cached_neuron_stake_e8s, tokenInfo.decimals).toString(),
              )} ${tokenInfo.symbol}`
            : "--"}
        </Typography>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Typography>{seconds ? secondsToDuration({ seconds }) : "--"}</Typography>
      </Box>
    </Box>
  );
}

export default function Neuron() {
  const theme = useTheme() as Theme;
  const { root_id, neuron_id } = useParams<{ root_id: string; neuron_id: string }>();

  console.log("root_id", root_id);
  console.log("neuron_id", neuron_id);

  const principal = useAccountPrincipalString();

  const { result: listedSNS } = useListDeployedSNSs();
  const { result: snsTokens } = useSNSTokensRootIds();

  const { governance_id, ledger_id } = useMemo(() => {
    if (!root_id || !listedSNS) return { governance_id: undefined, ledger_id: undefined };

    const instance = listedSNS.instances.find((e) => e.root_canister_id.toString() === root_id);

    if (!instance) return { governance_id: undefined, ledger_id: undefined };

    return {
      governance_id: instance.governance_canister_id.toString(),
      ledger_id: instance.ledger_canister_id.toString(),
    };
  }, [listedSNS, root_id]);

  const { result: neuronSystemParameters } = useNervousSystemParameters(governance_id);

  const snsToken = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.find((e) => e.root_canister_id === root_id);
  }, [snsTokens, root_id]);

  const { result: tokenInfo } = useTokenInfo(ledger_id);

  const { result: listNeurons, loading } = useListNeurons({
    canisterId: governance_id,
    limit: 100,
    of_principal: principal,
  });

  const bytes_neuron_id = useMemo(() => {
    return hexToBytes(neuron_id);
  }, [neuron_id]);

  const { result: neuron } = useNeuron(governance_id, bytes_neuron_id);

  const { formatted_neuron, seconds } = useMemo(() => {
    if (!neuron) return { formatted_neuron: undefined, seconds: undefined };

    const formatted_neuron = neuronFormat(neuron);
    const seconds = getDissolvingTimeInSeconds(neuron) ?? formatted_neuron.dissolve_delay;

    return { formatted_neuron, seconds };
  }, [neuron]);

  return (
    <MainCard>
      <Flex justify="space-between" align="center">
        <Flex gap="0 10px" align="center">
          <AvatarImage src={snsToken?.logo} sx={{ width: "24px", height: "24px" }} />
          <Typography color="text.primary" fontWeight={500}>
            {snsToken?.name ?? "--"}
          </Typography>
        </Flex>

        <Flex gap="0 5px" align="center">
          <Typography color="text.primary">{neuron_id ? shorten(neuron_id, 6) : "--"}</Typography>
          {neuron_id ? (
            <Copy content={neuron_id}>
              <CopyIcon color={theme.colors.darkSecondaryMain} />
            </Copy>
          ) : null}
        </Flex>
      </Flex>

      <Box sx={{ margin: "40px 0 0 0" }}>
        <Typography color="text.primary" fontWeight={500} fontSize="28px" align="center">
          {tokenInfo && formatted_neuron
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(formatted_neuron.cached_neuron_stake_e8s, tokenInfo.decimals).toString(),
              )} ${tokenInfo.symbol}`
            : "--"}
        </Typography>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Typography align="center" fontSize="16px">
            <Trans>Voting Power</Trans>&nbsp;
            {neuron && tokenInfo && neuronSystemParameters
              ? getNervousVotingPower(neuron, neuronSystemParameters, tokenInfo.decimals)
              : "--"}
          </Typography>
        </Box>
      </Box>

      {!loading ? (
        listNeurons && listNeurons?.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gap: "20px",
              margin: "20px 0 0 0",
              gridTemplateColumns: "1fr 1fr 1fr",
              "@media (max-width:1088px)": {
                gridTemplateColumns: "1fr 1fr",
              },
              "@media (max-width:640px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {listNeurons?.map((neuron, index) => (
              <NeuronItem key={index} neuron={neuron} ledger_id={ledger_id} root_id={root_id} />
            ))}
          </Box>
        ) : (
          <Typography sx={{ margin: "20px 0 0 0" }}>No Neurons</Typography>
        )
      ) : (
        <Box sx={{ margin: "20px 0 0 0" }}>
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
        </Box>
      )}
    </MainCard>
  );
}
