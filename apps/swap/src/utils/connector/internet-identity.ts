import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { Identity } from "@dfinity/agent";
import { ConnectorAbstract, CreateActorArgs, Connector, type WalletConnectorConfig } from "./connectors";

const iiExpireTime = 7 * 24 * 3600; // seconds

export class InternetIdentityConnector implements ConnectorAbstract {
  private config: {
    whitelist: Array<string>;
    host: string;
    providerUrl: string;
    dev: boolean;
  };

  private identity?: Identity;

  private principal?: string;

  private client?: AuthClient;

  public type = Connector.IC;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: config.providerUrl ?? "https://identity.ic0.app",
      dev: false,
    };
  }

  async init() {
    this.client = await AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
      },
    });
    const isConnected = await this.isConnected();

    if (isConnected) {
      this.identity = this.client.getIdentity();
      this.principal = this.identity?.getPrincipal().toString();
    }

    return true;
  }

  async isConnected(): Promise<boolean> {
    return !!(await this.client?.isAuthenticated());
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    const agent = await HttpAgent.create({
      ...this.config,
      identity: this.identity,
    });

    if (this.config.dev) {
      // Fetch root key for certificate validation during development
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

  async connect() {
    await new Promise((resolve, reject) => {
      this.client?.login({
        identityProvider: this.config.providerUrl,
        onSuccess: () => resolve(true),
        onError: reject,
        maxTimeToLive: BigInt(iiExpireTime * 1000 * 1000 * 1000),
      });
    });
    window.localStorage.setItem("ii-expire-time", (new Date().getTime() + iiExpireTime * 1000).toString());
    const identity = this.client?.getIdentity();
    const principal = identity?.getPrincipal().toString();
    this.identity = identity;
    this.principal = principal;
    return true;
  }

  async disconnect() {
    await this.client?.logout();
  }

  async expired() {
    const iiExpireTime = window.localStorage.getItem("ii-expire-time");
    if (!iiExpireTime) return true;
    return new Date().getTime() >= Number(iiExpireTime);
  }
}

export const InternetIdentity = {
  connector: InternetIdentityConnector,
  id: "ii",
};
