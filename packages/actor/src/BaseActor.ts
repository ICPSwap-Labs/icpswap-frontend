import { IDL, Actor, HttpAgent } from "@icpswap/dfinity";

export interface CreateBaseActorProps {
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
  actorOptions?: any;
  agent: HttpAgent;
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

  //@ts-ignore
  return Actor.createActor<T>(interfaceFactory, {
    agent: agent,
    canisterId,
    ...(actorOptions ?? {}),
  });
}
