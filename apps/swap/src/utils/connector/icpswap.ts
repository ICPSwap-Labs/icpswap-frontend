import { AuthClient } from "@honopu/auth-client";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { Identity } from "@dfinity/agent";
import { type CreateActorArgs, ConnectorAbstract, Connector, WalletConnectorConfig } from "./connectors";

const EXPIRE_TIME = 7 * 24 * 3600; // seconds

export class ICPSwapConnector implements ConnectorAbstract {
  private config: {
    whitelist: Array<string>;
    host: string;
    providerUrl: string;
    dev: boolean;
  };

  private identity?: Identity;

  private principal?: string;

  private client?: AuthClient;

  public type = Connector.ICPSwap;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: "http://localhost:8088",
      dev: false,
    };
  }

  async init() {
    this.client = await AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
      },
      keyType: "Ed25519",
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
      host: this.config.host,
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
        onSuccess: () => resolve(true),
        onError: reject,
        maxTimeToLive: BigInt(EXPIRE_TIME * 1000 * 1000 * 1000),
      });
    });

    const identity = this.client?.getIdentity();
    const principal = identity?.getPrincipal().toString();
    this.identity = identity;
    this.principal = principal;

    window.localStorage.setItem("ICPSwap-wallet-expire-time", (new Date().getTime() + EXPIRE_TIME * 1000).toString());

    return true;
  }

  async disconnect() {
    await this.client?.logout();
  }

  async expired() {
    const iiExpireTime = window.localStorage.getItem("ICPSwap-wallet-expire-time");
    if (!iiExpireTime) return true;
    return new Date().getTime() >= Number(iiExpireTime);
  }
}

export const ICPSwapWallet = {
  connector: ICPSwapConnector,
  id: "ICPSwap",
  type: Connector.ICPSwap,
};
