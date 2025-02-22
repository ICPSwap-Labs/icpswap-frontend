import { Box, Typography, useTheme } from "components/Mui";
import { useListDeployedSNSs, useListNeurons, useNervousSystemParameters } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { LoadingRow, Copy, Wrapper } from "components/index";
import type { Neuron, NervousSystemParameters } from "@icpswap/types";
import { SnsNeuronPermissionType } from "@icpswap/constants";
import { SelectSns } from "components/sns/SelectSNSTokens";
import { useAccountPrincipal, useAccountPrincipalString } from "store/auth/hooks";
import { neuronFormat, NeuronState, getDissolvingTimeInSeconds } from "utils/sns/neurons";
import { parseTokenAmount, shorten, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { Lock, Clock } from "react-feather";
import { useToken } from "hooks/index";
import { secondsToDuration } from "@dfinity/utils";
import { Tabs } from "components/sns/Tab";
import { Token } from "@icpswap/swap-sdk";

import { SplitNeuron } from "./components/SplitNeuron";
import { StopDissolving } from "./components/StopDissolving";
import { Dissolve } from "./components/Dissolve";
import { Stake } from "./components/Stake";
import { SetDissolveDelay } from "./components/Delay";
import { Disburse } from "./components/Disburse";
import { Maturity } from "./components/Maturity";
import { Followings } from "./components/Following";
import { HotKeys } from "./components/HotKeys";
import { StakeToCreateNeuron } from "./components/StakeToCreateNeuron";

interface NeuronProps {
  neuron: Neuron;
  ledger_id: string | undefined;
  root_id: string | null;
  governance_id: string | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
  refreshTrigger: () => void;
  token: Token | undefined;
}

function NeuronItem({ neuron, token, governance_id, neuronSystemParameters, refreshTrigger }: NeuronProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const [splitNeuronOpen, setSplitNeuronOpen] = useState(false);

  const formatted_neuron = neuronFormat(neuron);

  const seconds = getDissolvingTimeInSeconds(neuron) ?? formatted_neuron.dissolve_delay;

  const { neuron_id, permissions } = useMemo(() => {
    const permission = neuron.permissions.filter(
      (permission) => permission.principal.toString() === principal?.toString(),
    )[0];

    return {
      neuron_id: neuron.id[0]?.id,
      permissions: [...(permission?.permission_type ?? [])],
    };
  }, [neuron, principal]);

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
            {token
              ? `${toSignificantWithGroupSeparator(
                  parseTokenAmount(formatted_neuron.cached_neuron_stake_e8s, token.decimals).toString(),
                )} ${token.symbol}`
              : "--"}
          </Typography>
        </Box>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Typography>{seconds ? secondsToDuration({ seconds }) : "--"}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "8px", margin: "20px 0 0 0", flexWrap: "wrap" }}>
          <SplitNeuron
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={token}
            neuronSystemParameters={neuronSystemParameters}
            neuron_stake={neuron.cached_neuron_stake_e8s}
            onSplitSuccess={handleSuccessTrigger}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_SPLIT)}
          />

          <Stake
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={token}
            onStakeSuccess={handleSuccessTrigger}
          />

          <SetDissolveDelay
            governance_id={governance_id}
            neuron_id={neuron.id[0]?.id}
            open={splitNeuronOpen}
            onClose={() => setSplitNeuronOpen(false)}
            token={token}
            neuron={neuron}
            neuronSystemParameters={neuronSystemParameters}
            neuron_stake={neuron.cached_neuron_stake_e8s}
            onSetSuccess={handleSuccessTrigger}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_CONFIGURE_DISSOLVE_STATE)}
          />

          {formatted_neuron.dissolve_state === NeuronState.Dissolving ? (
            <StopDissolving
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onStopSuccess={handleSuccessTrigger}
              disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_CONFIGURE_DISSOLVE_STATE)}
            />
          ) : formatted_neuron.dissolve_state === NeuronState.Dissolved ? (
            <Disburse
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onDisburseSuccess={handleSuccessTrigger}
              disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_DISBURSE)}
            />
          ) : (
            <Dissolve
              governance_id={governance_id}
              neuron_id={neuron.id[0]?.id}
              onDissolveSuccess={handleSuccessTrigger}
              disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_CONFIGURE_DISSOLVE_STATE)}
            />
          )}
        </Box>

        <Maturity
          neuron={neuron}
          token={token}
          governance_id={governance_id}
          neuron_id={neuron.id[0]?.id}
          onMaturitySuccess={handleSuccessTrigger}
          permissions={permissions}
        />

        <Box sx={{ margin: "20px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
          <Followings neuron_id={neuron_id} governance_id={governance_id} disabled={false} />

          <HotKeys
            neuron_id={neuron_id}
            governance_id={governance_id}
            neuron={neuron}
            onAddSuccess={handleSuccessTrigger}
            onRemoveSuccess={handleSuccessTrigger}
            disabled={!permissions.includes(SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_MANAGE_PRINCIPALS)}
          />
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

  const [, token] = useToken(ledger_id);

  return (
    <Wrapper>
      <Tabs />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0 0 0",
          width: "100%",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "10px 0",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        }}
      >
        <SelectSns value={selectedNeuron} onChange={setSelectedNeuron} />
        <Box>
          <StakeToCreateNeuron
            onStakeSuccess={handleRefresh}
            token={token}
            governance_id={governance_id}
            neuronSystemParameters={neuronSystemParameters}
          />
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
                token={token}
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
    </Wrapper>
  );
}
