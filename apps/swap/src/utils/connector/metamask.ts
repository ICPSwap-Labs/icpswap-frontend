import { type ActorSubclass, Actor, HttpAgent } from "@dfinity/agent";
import { Connector } from "@icpswap/actor";
import { MsqClient, MsqIdentity } from "@fort-major/msq-client";
import type { IConnector, CreateActorArgs, WalletConnectorConfig } from "./connectors";

const EXPIRE_TIME = 7 * 24 * 3600; // seconds
const EXPIRE_TIME_STORAGE_NAME = "metamask-expire-time";
// const REQUEST_LINK_DOMAIN = "https://app.icpswap.com";

export class MetamaskConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: boolean;
  };

  private identity?: any;

  private principal?: string;

  private client?: MsqClient;

  public type = Connector.Metamask;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      dev: false,
      providerUrl: "",
    };
  }

  async init() {
    return true;
  }

  async isConnected() {
    return this.client ? await this.client?.isAuthorized() : false;
  }

  async connect() {
    if (this.client && (await this.isConnected())) {
      // const requestLinkResult: boolean = await this.client.requestLink(REQUEST_LINK_DOMAIN);
      // if (!requestLinkResult) return false;

      const identity: MsqIdentity | null = await this.client.requestLogin();

      if (identity === null) {
        // the user has rejected to log in
        return false;
      }

      window.localStorage.setItem(EXPIRE_TIME_STORAGE_NAME, (new Date().getTime() + EXPIRE_TIME * 1000).toString());
      this.identity = identity;
      this.principal = identity?.getPrincipal().toString();
    } else {
      const result = await MsqClient.create();

      if (!("Ok" in result)) return false;

      const client = result.Ok;
      // const requestLinkResult: boolean = await client.requestLink(REQUEST_LINK_DOMAIN);
      // if (!requestLinkResult) return false;

      const identity: MsqIdentity | null = await client.requestLogin();

      if (identity === null) {
        // the user has rejected to log in
        return false;
      }

      window.localStorage.setItem(EXPIRE_TIME_STORAGE_NAME, (new Date().getTime() + EXPIRE_TIME * 1000).toString());
      this.identity = identity;
      this.principal = identity.getPrincipal().toString();
      this.client = client;

      return true;
    }

    return true;
  }

  async disconnect() {
    await this.client?.requestLogout();
  }

  async createActor<Service>({ canisterId, interfaceFactory }: CreateActorArgs): Promise<ActorSubclass<Service>> {
    const httpAgent = await HttpAgent.create({ identity: this.identity, host: this.config.host });

    return Actor.createActor<Service>(interfaceFactory, {
      agent: httpAgent,
      canisterId,
    });
  }

  async expired() {
    const expireTime = window.localStorage.getItem(EXPIRE_TIME_STORAGE_NAME);
    if (!expireTime) return true;
    return new Date().getTime() >= Number(expireTime);
  }
}
