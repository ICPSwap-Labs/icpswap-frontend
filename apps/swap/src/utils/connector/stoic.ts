// @ts-ignore
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Connector } from "@icpswap/actor";
import { type CreateActorArgs, IConnector, ConnectorType, type WalletConnectorConfig } from "./connectors";

export class StoicConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: boolean;
  };

  private identity?: any;

  private principal?: string;

  public type = ConnectorType.STOIC;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: "https://www.stoicwallet.com",
      dev: false,
    };
  }

  async init() {
    const identity = await StoicIdentity.load(this.config.providerUrl);

    if (identity) {
      this.identity = identity;
      this.principal = identity.getPrincipal().toText();
    }

    return true;
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    const agent = new HttpAgent({
      ...this.config,
      identity: this.identity,
    });

    // Fetch root key for certificate validation during development
    if (this.config.dev) {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }

    return Actor.createActor(interfaceFactory, {
      agent,
      canisterId,
    });
  }

  async isConnected() {
    const identity = await StoicIdentity.load();
    return !!identity;
  }

  async connect() {
    this.identity = await StoicIdentity.connect();
    this.principal = this.identity.getPrincipal().toText();
    return true;
  }

  async disconnect() {
    await StoicIdentity.disconnect();
  }

  async expired() {
    return false;
  }
}

export const StoicWallet = {
  connector: StoicConnector,
  id: "stoic",
  type: Connector.STOIC,
};
