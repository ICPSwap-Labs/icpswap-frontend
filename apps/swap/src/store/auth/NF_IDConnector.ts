import { Actor, type ActorSubclass, Agent, HttpAgent } from "@icpswap/dfinity";
import type { IDL } from "@icpswap/dfinity";
import { ic_host } from "@icpswap/constants";

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
    // this.agent?.fetchRootKey().catch((err) => {
    //   console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    //   console.error(err);
    // });

    return Actor.createActor(interfaceFactory, {
      agent:
        this.agent ??
        (await HttpAgent.create({
          host: ic_host,
        })),
      canisterId,
    });
  }

  async disconnect() {
    return true;
  }
}
