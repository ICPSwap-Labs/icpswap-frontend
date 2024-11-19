/* eslint-disable no-new-func */

import { Actor, HttpAgent, fetchCandid } from "@dfinity/agent";
import { useCallback } from "react";
import { candidToJsService } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getCanisterCandidString(canisterId: string) {
  const agent = new HttpAgent({
    host: "https://ic0.app/",
    identity: null,
  });

  const candidString = await fetchCandid(canisterId, agent);

  if (candidString) {
    const jsResult = await (await candidToJsService()).did_to_js(candidString);

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
