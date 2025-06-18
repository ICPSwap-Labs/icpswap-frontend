import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

interface NodeMachineResult {
  total_nodes: Array<[number, string]>;
  up_nodes: Array<[number, string]>;
}

export function useNodeMachines() {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch("https://ic-api.internetcomputer.org/api/v3/metrics/ic-nodes-count").catch(
        () => undefined,
      );
      if (!fetch_result) return undefined;
      return (await fetch_result.json()) as NodeMachineResult;
    }, []),
  );
}

export interface NodeMachinesOfSubnet {
  alertname: string;
  dc_id: string;
  dc_name: string;
  ip_address: string;
  node_id: string;
  node_operator_id: string;
  node_provider_id: string;
  node_provider_name: string;
  node_type: string;
  owner: string;
  region: string;
  status: string;
  subnet_id: string;
}

export interface NodeMachinesOfSubnetResult {
  nodes: NodeMachineResult[];
}

interface UserNodeMachinesOfSubnetProps {
  subnet: string | Null;
}

export function useNodeMachinesOfSubnet({ subnet }: UserNodeMachinesOfSubnetProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(subnet)) return undefined;
      const fetch_result = await fetch(`https://ic-api.internetcomputer.org/api/v3/nodes?subnet=${subnet}`).catch(
        () => undefined,
      );
      if (!fetch_result) return undefined;
      return (await fetch_result.json()) as NodeMachinesOfSubnetResult;
    }, [subnet]),
  );
}
