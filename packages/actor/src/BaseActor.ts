import { Actor, HttpAgent } from "@dfinity/agent";
import { SignerAgent } from "@slide-computer/signer-agent";
import { IDL } from "@dfinity/candid";

export interface CreateBaseActorProps {
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
  actorOptions?: any;
  agent: HttpAgent | SignerAgent;
  fetchRootKey?: boolean;
}

export async function createBaseActor<T>({
  canisterId,
  interfaceFactory,
  actorOptions,
  agent,
  fetchRootKey = false,
}: CreateBaseActorProps) {
  // Fetch root key for certificate validation during development
  if (fetchRootKey) {
    await agent?.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  return Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
    ...(actorOptions ?? {}),
  });
}
