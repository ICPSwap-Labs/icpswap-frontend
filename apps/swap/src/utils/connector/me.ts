import type { ActorSubclass } from "@dfinity/agent";
import type { IConnector, CreateActorArgs, WalletConnectorConfig } from "./connectors";
import { AstroXWebViewHandler } from "@astrox/sdk-webview";
import { IC as AuthClient } from "@astrox/sdk-web";
import { Connector } from "@icpswap/actor";

const MeExpireTime = 7 * 24 * 3600; // seconds
const MAX_DELEGATION_TARGETS = 900;

export function isMeWebview() {
  return !!window.astrox_webview;
}

const astrox = new AstroXWebViewHandler();

export class MeConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: Boolean;
  };
  private identity?: any;
  private principal?: string;
  private client?: AuthClient;
  public type = Connector.ME;

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
    if (isMeWebview()) {
      await astrox.init();

      if (!this.isConnected()) {
        const boolean = await astrox.connect({
          delegationTargets: this.config.whitelist,
          host: this.config.host,
          customDomain: "https://app.icpswap.com",
        });

        this.principal = astrox.identity?.getPrincipal().toString();
        this.identity = astrox.identity;

        return boolean;
      } else {
        this.principal = astrox.identity?.getPrincipal().toString();
        this.identity = astrox.identity;
      }
    } else {
      this.client = this.client
        ? this.client
        : await AuthClient.create({
            useFrame: document.body.clientWidth > 768 ? true : undefined,
            signerProviderUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer",
            identityProvider: `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize`,
            walletProviderUrl: `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction`,
            onAuthenticated: async (icInstance: AuthClient) => {},
            host: this.config.host,
          });

      const isConnected = await this.isConnected();

      if (isConnected) {
        this.identity = this.client.identity;
        this.principal = this.identity?.getPrincipal().toString();
      }
    }

    return true;
  }

  async isConnected() {
    if (isMeWebview()) {
      return await astrox.isConnected();
    } else {
      return this.client ? await this.client?.isAuthenticated() : false;
    }
  }

  async connect() {
    if (await this.isConnected()) {
      this.principal = this.identity?.getPrincipal().toString();
    } else {
      if (isMeWebview()) {
        const boolean = await astrox.connect({
          //Max delegation targets is 1000 in Me Wallet
          delegationTargets: this.config.whitelist,
          host: this.config.host,
          customDomain: "https://app.icpswap.com",
        });

        const identity = astrox.identity;

        this.principal = identity?.getPrincipal().toString();

        return boolean;
      } else {
        const delegationTargets = this.config.whitelist;

        const client = await this.client?.connect({
          useFrame: !(window.innerWidth < 768),
          signerProviderUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer",
          identityProvider: `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize`,
          walletProviderUrl: `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction`,
          delegationTargets:
            delegationTargets.length > MAX_DELEGATION_TARGETS
              ? delegationTargets.slice(0, MAX_DELEGATION_TARGETS)
              : delegationTargets,
          customDomain: "https://app.icpswap.com",
          maxTimeToLive: BigInt(MeExpireTime * 1000 * 1000 * 1000),
          onAuthenticated: async (client: AuthClient) => {},
        });

        if (!!client) {
          window.localStorage.setItem("me-expire-time", (new Date().getTime() + MeExpireTime * 1000).toString());
          this.identity = client.identity;
          this.principal = this.identity?.getPrincipal().toString();
        }

        return !!client;
      }
    }

    return true;
  }

  async disconnect() {
    if (isMeWebview()) {
      await astrox.disconnect();
    } else {
      await this.client?.disconnect();
    }
  }

  async createActor<Service>({ canisterId, interfaceFactory }: CreateActorArgs): Promise<ActorSubclass<Service>> {
    if (isMeWebview()) {
      // @ts-ignore
      return await astrox.createActor<Service>(canisterId, interfaceFactory);
    } else {
      // @ts-ignore
      return await this.client?.createActor<Service>(interfaceFactory, canisterId);
    }
  }

  async expired() {
    if (isMeWebview()) return false;
    const meExpireTime = window.localStorage.getItem("me-expire-time");
    if (!meExpireTime) return true;
    return new Date().getTime() >= Number(meExpireTime);
  }
}
