/* eslint-disable no-new-func */

import { IDL } from "@dfinity/candid";
import { Actor, QueryResponseReplied, HttpAgent } from "@dfinity/agent";
import { useCallback } from "react";
import { candidToJsService } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getCanisterCandidString(canisterId: string) {
  const agent = new HttpAgent({
    host: "https://ic0.app/",
    identity: null,
  });

  const result = await agent.query(canisterId, {
    methodName: "__get_candid_interface_tmp_hack",
    // Null
    arg: Buffer.from([68, 73, 68, 76, 0, 0]),
  });

  if ((result as QueryResponseReplied).status) {
    const candid = IDL.decode([IDL.Text], Buffer.from((result as QueryResponseReplied).reply.arg))[0] as string;
    const jsResult = await (await candidToJsService()).did_to_js(candid);

    if (jsResult && jsResult.length) {
      return jsResult[0];
    }
  }
}

export function useCanisterCandidString(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getCanisterCandidString(canisterId);
    }, [canisterId]),
  );
}

export async function getCanisterCandidFromDidString(canisterId: string, str: string) {
  const agent = new HttpAgent({
    host: "https://ic0.app/",
    identity: null,
  });

  const did = str.replace(/export const idlFactory =\s+/, "return ").replace("export", "");
  // TODO: fix
  const actor_ = Actor.createActor(new Function(did)(), {
    agent,
    canisterId,
  });

  return Object.fromEntries(Actor.interfaceOf(actor_)._fields);
}

export function useCanisterCandidFromDidString(canisterId: string | undefined, str: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !str) return undefined;
      return await getCanisterCandidFromDidString(canisterId, str);
    }, [canisterId, str]),
  );
}

export async function getCanisterCandid(canisterId: string) {
  const candidString = await getCanisterCandidString(canisterId);

  if (candidString) {
    const agent = new HttpAgent({
      host: "https://ic0.app/",
      identity: null,
    });

    const did = candidString.replace(/export const idlFactory =\s+/, "return ").replace("export", "");
    // TODO: fix
    const actor_ = Actor.createActor(new Function(did)(), {
      agent,
      canisterId,
    });
    return Object.fromEntries(Actor.interfaceOf(actor_)._fields);
  }
}

export function useCanisterCandid(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getCanisterCandid(canisterId);
    }, [canisterId]),
  );
}
