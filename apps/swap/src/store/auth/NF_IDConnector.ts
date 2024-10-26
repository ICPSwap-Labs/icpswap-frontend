import { Actor, ActorSubclass, HttpAgent, type Agent } from "@dfinity/agent";
import { ic_host } from "@icpswap/constants";
import { IDL } from "@dfinity/candid";

export type CreateActorArgs = {
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
};

export class NF_IDConnector {
  public agent: Agent | null = null;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    // Fetch root key for certificate validation during development
    this.agent?.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });

    return Actor.createActor(interfaceFactory, {
      agent:
        this.agent ??
        new HttpAgent({
          host: ic_host,
        }),
      canisterId,
    });
  }

  async disconnect() {
    return true;
  }
}
