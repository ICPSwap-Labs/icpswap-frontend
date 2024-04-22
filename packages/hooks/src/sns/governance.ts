import { sns_governance } from "@icpswap/actor";
import { useCallback } from "react";
import { availableArgsNull, resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import type {
  ListNeuronsResponse,
  NervousSystemParameters,
  GetNeuronResponse,
  Neuron,
  NeuronId,
  ManageNeuronResponse,
  ListNervousSystemFunctionsResponse,
} from "@icpswap/types";
import { useCallsData } from "../useCallData";
import { neuronOperationCommand } from "./neuronCommand";

export async function getNeuron(canisterId: string, neuron_id: Uint8Array | number[]) {
  const result = resultFormat<GetNeuronResponse>(
    await (
      await sns_governance(canisterId)
    ).get_neuron({
      neuron_id: availableArgsNull<{ id: Uint8Array | number[] }>({ id: neuron_id }),
    }),
  ).data?.result;

  const neuron: Neuron | undefined = result[0] ? ("Neuron" in result[0] ? result[0].Neuron : undefined) : undefined;

  return neuron;
}

export function useNeuron(
  governance_id: string | undefined,
  neuron_id: Uint8Array | number[] | undefined,
  refresh?: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!governance_id || !neuron_id) return undefined;
      return await getNeuron(governance_id, neuron_id);
    }, [governance_id, neuron_id]),
    refresh,
  );
}

export interface GetListNeuronsArgs {
  canisterId: string;
  of_principal: string | undefined;
  limit: number;
  start_page_at: Uint8Array | number[] | undefined;
}

export async function getListNeurons({ canisterId, of_principal, limit, start_page_at }: GetListNeuronsArgs) {
  return resultFormat<ListNeuronsResponse>(
    await (
      await sns_governance(canisterId)
    ).list_neurons({
      of_principal: availableArgsNull<Principal>(of_principal ? Principal.fromText(of_principal) : undefined),
      limit,
      start_page_at: availableArgsNull<{ id: Uint8Array | number[] }>(
        start_page_at ? { id: start_page_at } : undefined,
      ),
    }),
  ).data?.neurons;
}

export interface UseListNeuronsArgs {
  canisterId: string | undefined;
  of_principal?: string;
  limit: number;
  start_page_at?: Uint8Array | number[];
  refresh?: boolean | number;
}

export function useListNeurons({ canisterId, of_principal, limit, start_page_at, refresh }: UseListNeuronsArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !of_principal) return undefined;
      return await getListNeurons({ canisterId, of_principal, limit, start_page_at });
    }, [canisterId, of_principal, limit, start_page_at]),
    refresh,
  );
}

export async function getNervousSystemParameters(governance_id: string) {
  return resultFormat<NervousSystemParameters>(
    await (await sns_governance(governance_id)).get_nervous_system_parameters(null),
  ).data;
}

export function useNervousSystemParameters(governance_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!governance_id) return undefined;
      return await getNervousSystemParameters(governance_id);
    }, [governance_id]),
  );
}

export async function getNeuronSystemFunctions(governance_id: string) {
  return resultFormat<ListNervousSystemFunctionsResponse>(
    await (await sns_governance(governance_id)).list_nervous_system_functions(),
  ).data;
}

export function useNeuronSystemFunctions(governance_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!governance_id) return undefined;
      return await getNeuronSystemFunctions(governance_id);
    }, [governance_id]),
  );
}

export async function splitNeuron(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  amount: bigint,
  memo: bigint,
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          Split: {
            memo,
            amount_e8s: amount,
          },
        },
      ],
    }),
  );
}

export async function stopDissolvingNeuron(governance_id: string, neuron_id: Uint8Array | number[]) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: neuronOperationCommand({
        StopDissolving: {},
      }),
    }),
  );
}

export async function dissolveNeuron(governance_id: string, neuron_id: Uint8Array | number[]) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: neuronOperationCommand({ StartDissolving: {} }),
    }),
  );
}

export async function increaseNeuronDelay(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  additionalDissolveDelaySeconds: bigint,
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: neuronOperationCommand({
        IncreaseDissolveDelay: {
          additional_dissolve_delay_seconds: Number(additionalDissolveDelaySeconds),
        },
      }),
    }),
  );
}

export async function autoStakeMaturity(governance_id: string, neuron_id: Uint8Array | number[], autoStake: boolean) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: neuronOperationCommand({
        ChangeAutoStakeMaturity: {
          requested_setting_for_auto_stake_maturity: autoStake,
        },
      }),
    }),
  );
}

export async function claimOrRefreshNeuronFromAccount(
  governance_id: string,
  controller: Principal,
  memo: bigint,
  subaccount: number[],
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount,
      command: [
        {
          ClaimOrRefresh: {
            by: [
              {
                MemoAndController: {
                  controller: controller === undefined ? [] : [controller],
                  memo,
                },
              },
            ],
          },
        },
      ],
    }),
  );
}

export async function claimOrRefreshNeuron(governance_id: string, neuron_id: Uint8Array | number[]) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          ClaimOrRefresh: {
            by: [
              {
                NeuronId: {},
              },
            ],
          },
        },
      ],
    }),
  );
}

export async function disburseNeuron(governance_id: string, neuron_id: Uint8Array | number[]) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          Disburse: {
            to_account: [],
            amount: [],
          },
        },
      ],
    }),
  );
}

export async function disburseNeuronMaturity(governance_id: string, neuron_id: Uint8Array | number[]) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          DisburseMaturity: {
            to_account: [],
            percentage_to_disburse: 100,
          },
        },
      ],
    }),
  );
}

export async function stakeNeuronMaturity(governance_id: string, neuron_id: Uint8Array | number[], percent: number) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          StakeMaturity: {
            percentage_to_stake: [percent],
          },
        },
      ],
    }),
  );
}

export async function setNeuronFollows(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  function_id: bigint,
  follows: NeuronId[],
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          Follow: {
            function_id,
            followees: follows,
          },
        },
      ],
    }),
  );
}

export async function neuronVoteForProposal(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  vote: number,
  proposal_id: bigint,
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          RegisterVote: {
            vote,
            proposal: [{ id: proposal_id }],
          },
        },
      ],
    }),
  );
}

export async function neuronAddPermissions(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  principal: Principal,
  permissions: Int32Array | number[],
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          AddNeuronPermissions: {
            permissions_to_add: [
              {
                permissions,
              },
            ],
            principal_id: [principal],
          },
        },
      ],
    }),
  );
}

export async function neuronRemovePermissions(
  governance_id: string,
  neuron_id: Uint8Array | number[],
  principal: Principal,
  permissions: Int32Array | number[],
) {
  return resultFormat<ManageNeuronResponse>(
    await (
      await sns_governance(governance_id, true)
    ).manage_neuron({
      subaccount: [...neuron_id],
      command: [
        {
          RemoveNeuronPermissions: {
            permissions_to_remove: [
              {
                permissions,
              },
            ],
            principal_id: [principal],
          },
        },
      ],
    }),
  );
}
