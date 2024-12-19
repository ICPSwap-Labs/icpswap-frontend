import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { Identity } from "@dfinity/agent";
import { requestTransfer } from "@nfid/wallet";
import { defaultWindowFeatures } from "@nfid/core";
import { type CreateActorArgs, IConnector, ConnectorType, WalletConnectorConfig } from "./connectors";

const APPLICATION_NAME = "ICPSwap";
const APPLICATION_LOGO_URL = "https://r7ftp-xaaaa-aaaag-qbbsq-cai.raw.ic0.app/ICPSwap_96x96.png";
const APP_META = `applicationName=${APPLICATION_NAME}&applicationLogo=${APPLICATION_LOGO_URL}`;
const AUTH_PATH = `/authenticate/?${APP_META}#authorize`;
const NFID_ORIGIN = "https://nfid.one";
const NF_ID_AUTH_URL = NFID_ORIGIN + AUTH_PATH;

export const NF_ID_LOGIN_CONFIG = {
  maxTimeToLive: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1e9),
  identityProvider: NF_ID_AUTH_URL,
  windowOpenerFeatures:
    `left=${window.screen.width / 2 - 525 / 2}, ` +
    `top=${window.screen.height / 2 - 705 / 2},` +
    `toolbar=0,location=0,menubar=0,width=525,height=705`,
};

export class NF_IDConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    host: string;
    providerUrl: string;
    dev: boolean;
  };

  private identity?: Identity;

  private principal?: string;

  private client?: AuthClient;

  public type = ConnectorType.NFID;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: NF_ID_AUTH_URL,
      dev: false,
    };
  }

  async init() {
    this.client = this.client
      ? this.client
      : await AuthClient.create({
          idleOptions: {
            idleTimeout: 30 * 24 * 3_600_000,
            disableIdle: true,
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
    const agent = new HttpAgent({
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
        onSuccess: () => resolve(true),
        onError: reject,
        ...NF_ID_LOGIN_CONFIG,
      });
    });
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
    return false;
  }
}

export const NF_ID = {
  connector: NF_IDConnector,
  id: "NF ID",
};

const REQ_TRANSFER = "wallet/request-transfer";
const PROVIDER_URL = new URL(`${NFID_ORIGIN}/${REQ_TRANSFER}?${APP_META}`);

export const NFIDRequestTransfer = async ({ to, amount }: { to: string; amount: number }) =>
  await requestTransfer(
    { to, amount },
    {
      provider: PROVIDER_URL,
      windowFeatures: defaultWindowFeatures,
    },
  );
