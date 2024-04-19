import { Box, Button, Typography, useTheme } from "@mui/material";
import { useListDeployedSNSs, useListNeurons, useNervousSystemParameters } from "@icpswap/hooks";
import { Trans } from "@lingui/macro";
import { useMemo, useState } from "react";
import { LoadingRow, Copy } from "components/index";
import type { Neuron, NervousSystemParameters } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { SelectSns } from "components/sns/SelectSNSTokens";
import { useAccountPrincipalString } from "store/auth/hooks";
import { neuronFormat, NeuronState, getDissolvingTimeInSeconds } from "utils/sns/neurons";
import { parseTokenAmount, shorten, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { Lock, Clock } from "react-feather";
import { useTokenInfo } from "hooks/token";
import { secondsToDuration } from "@dfinity/utils";

import { SplitNeuron } from "./components/SplitNeuron";
import { StopDissolving } from "./components/StopDissolving";
import { Dissolve } from "./components/Dissolve";
import { Stake } from "./components/Stake";
import { SetDissolveDelay } from "./components/Delay";
import { Disburse } from "./components/Disburse";
import { Maturity } from "./components/Maturity";
import { Followings } from "./components/Following";

interface NeuronProps {
  neuron: Neuron;
  ledger_id: string | undefined;
  root_id: string | null;
  governance_id: string | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
  refreshTrigger: () => void;
}

function NeuronItem({ neuron, ledger_id, governance_id, neuronSystemParameters, refreshTrigger }: NeuronProps) {
  const theme = useTheme() as Theme;
  const [splitNeuronOpen, setSplitNeuronOpen] = useState(false);

  const { result: tokenInfo } = useTokenInfo(ledger_id);

  const formatted_neuron = neuronFormat(neuron);

  const seconds = getDissolvingTimeInSeconds(neuron) ?? formatted_neuron.dissolve_delay;

  const neuron_id = useMemo(() => {
    return neuron.id[0]?.id;
  }, [neuron]);

  const handleSuccessTrigger = () => {
    refreshTrigger();
  };

  return formatted_neuron.dissolve_state === NeuronState.Spawning ? null : (
    <>
      <Box
        sx={{
          background: theme.palette.background.level4,
          borderRadius: "12px",
          padding: "20px",
          "@media(max-width: 640px)": {
            padding: "10px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Typography color="text.primary">{formatted_neuron.id ? shorten(formatted_neuron.id, 6) : "--"}</Typography>
            {formatted_neuron.id ? (
              <Copy content={formatted_neuron.id}>
                <CopyIcon color={theme.colors.darkSecondaryMain} />
              </Copy>
            ) : null}
          </Box>

          <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
            {formatted_neuron.dissolve_state === NeuronState.Locked ? <Lock size="16px" /> : null}
            {formatted_neuron.dissolve_state === NeuronState.Dissolving ? <Clock size="16px" /> : null}
            <Typography>{formatted_neuron.dissolve_state_text}</Typography>
          </Box>
        </Box>

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

        {/* <Box sx={{ margin: "20px 0 0 0" }}>
          <Typography align="center" fontSize="16px">
            <Trans>Voting Power</Trans>&nbsp;
            {neuron && tokenInfo && neuronSystemParameters
              ? getNervousVotingPower(neuron, neuronSystemParameters, tokenInfo.decimals)
              : "--"}
          </Typography>
        </Box> */}

        <Box sx={{ display: "flex", gap: "0 8px", margin: "20px 0 0 0" }}>
          <SplitNeuron
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={tokenInfo}
            neuronSystemParameters={neuronSystemParameters}
            neuron_stake={neuron.cached_neuron_stake_e8s}
            onSplitSuccess={handleSuccessTrigger}
          />

          <Stake
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={tokenInfo}
            onStakeSuccess={handleSuccessTrigger}
          />

          <SetDissolveDelay
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={tokenInfo}
            neuron={neuron}
            neuronSystemParameters={neuronSystemParameters}
            neuron_stake={neuron.cached_neuron_stake_e8s}
            onSetSuccess={handleSuccessTrigger}
          />

          {formatted_neuron.dissolve_state === NeuronState.Dissolving ? (
            <StopDissolving
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onStopSuccess={handleSuccessTrigger}
            />
          ) : formatted_neuron.dissolve_state === NeuronState.Dissolved ? (
            <Disburse
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onDisburseSuccess={handleSuccessTrigger}
            />
          ) : (
            <Dissolve
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onDissolveSuccess={handleSuccessTrigger}
            />
          )}
        </Box>

        <Maturity
          neuron={neuron}
          token={tokenInfo}
          governance_id={governance_id}
          neuron_id={neuron.id[0]?.id}
          onMaturitySuccess={handleSuccessTrigger}
        />

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Followings neuron_id={neuron_id} governance_id={governance_id} />
        </Box>
      </Box>
    </>
  );
}

export default function Neurons() {
  const principal = useAccountPrincipalString();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const [selectedNeuron, setSelectedNeuron] = useState<string | null>("csyra-haaaa-aaaaq-aacva-cai");

  const { result: listedSNS } = useListDeployedSNSs();

  const sns = useMemo(() => {
    if (!selectedNeuron || !listedSNS) return undefined;

    const instance = listedSNS.instances.find((e) => e.root_canister_id.toString() === selectedNeuron);

    if (!instance) return undefined;

    return instance;
  }, [listedSNS, selectedNeuron]);

  const { governance_id, ledger_id } = useMemo(() => {
    if (!sns) return { governance_id: undefined, ledger_id: undefined };
    return { governance_id: sns.governance_canister_id.toString(), ledger_id: sns.ledger_canister_id.toString() };
  }, [sns]);

  const { result: neuronSystemParameters } = useNervousSystemParameters(governance_id);

  const { result: listNeurons, loading } = useListNeurons({
    canisterId: governance_id,
    limit: 100,
    of_principal: principal,
    refresh: refreshTrigger,
  });

  const handleRefresh = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  const filteredNeurons = useMemo(() => {
    if (!listNeurons) return undefined;
    return listNeurons?.filter((neuron) => neuron.cached_neuron_stake_e8s !== BigInt(0));
  }, [listNeurons]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: "1400px", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SelectSns value={selectedNeuron} onChange={setSelectedNeuron} />
          <Box>
            <Button variant="contained">
              <Trans>Stake</Trans>
            </Button>
          </Box>
        </Box>

        {!loading ? (
          filteredNeurons && filteredNeurons?.length > 0 ? (
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
              {filteredNeurons?.map((neuron, index) => (
                <NeuronItem
                  key={index}
                  neuron={neuron}
                  ledger_id={ledger_id}
                  root_id={selectedNeuron}
                  governance_id={governance_id}
                  neuronSystemParameters={neuronSystemParameters}
                  refreshTrigger={handleRefresh}
                />
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
      </Box>
    </Box>
  );
}