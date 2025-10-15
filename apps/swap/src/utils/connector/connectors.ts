import { ActorSubclass } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import { Connector } from "@icpswap/actor";

export type CreateActorArgs = {
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
};

export interface WalletConnectorConfig {
  whitelist: string[];
  host: string;
  providerUrl?: string;
}

export type ConnectCallback = () => Promise<void>;

export interface ConnectorAbstract {
  init: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  createActor: <Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs) => Promise<ActorSubclass<Service> | undefined>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  getPrincipal: string | undefined;
  type: Connector;
  expired: () => Promise<boolean>;
}

export { Connector };
