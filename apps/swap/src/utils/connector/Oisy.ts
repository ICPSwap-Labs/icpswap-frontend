import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { PostMessageTransport } from "@slide-computer/signer-web";
import { SignerAgent } from "@slide-computer/signer-agent";
import { Signer } from "@slide-computer/signer";

import { type CreateActorArgs, ConnectorAbstract, Connector, WalletConnectorConfig } from "./connectors";

export class OisyConnector implements ConnectorAbstract {
  private config: {
    whitelist: Array<string>;
    host: string;
    providerUrl: string;
    dev: boolean;
  };

  private signer: Signer | null = null;

  private agent: HttpAgent | SignerAgent<any> | null = null;

  private principal?: string;

  private signerAgent?: SignerAgent<Signer>;

  public type = Connector.Oisy;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: "https://oisy.com/sign",
      dev: false,
    };
  }

  async init() {
    return true;
  }

  async isConnected(): Promise<boolean> {
    return !!this.signerAgent && !!this.agent;
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    if (!this.signerAgent) {
      throw new Error("No signer agent available. Please connect first.");
    }

    try {
      return Actor.createActor(interfaceFactory, {
        agent: this.signerAgent,
        canisterId,
      });
    } catch (error) {
      console.error("[Oisy] Actor creation error:", error);
      throw error;
    }
  }

  async connect() {
    const agent = HttpAgent.createSync({ host: this.config.providerUrl });
    this.signerAgent = SignerAgent.createSync({
      signer: new Signer({
        transport: new PostMessageTransport({
          url: this.config.providerUrl,
          windowOpenerFeatures: "width=525,height=705",
          establishTimeout: 45000,
          disconnectTimeout: 45000,
          detectNonClickEstablishment: false,
        }),
      }),
      account: Principal.anonymous(),
      agent,
    });

    const accounts = await this.signerAgent.signer.accounts();

    if (!accounts || accounts.length === 0) {
      this.disconnect();
      throw new Error("No accounts returned from Oisy");
    }

    const principal = accounts[0].owner;
    if (principal.isAnonymous()) {
      throw new Error("Failed to authenticate with Oisy - got anonymous principal");
    }

    this.signerAgent.replaceAccount(principal);
    this.principal = (await this.signerAgent.getPrincipal())?.toString();
    this.agent = agent;

    return true;
  }

  async disconnect() {
    if (this.signer) {
      try {
        this.signer.closeChannel();
      } catch (error) {
        console.error("[Oisy] Error cleaning up signer:", error);
      }
      this.signer = null;
    }

    this.agent = null;
  }

  async expired() {
    return false;
  }
}

export const OisyWallet = {
  connector: OisyConnector,
  type: Connector.Oisy,
};
