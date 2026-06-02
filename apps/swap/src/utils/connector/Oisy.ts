import { HttpAgent, Actor, type ActorSubclass } from "@icpswap/dfinity";
import { Signer } from "@icp-sdk/signer";
import { PostMessageTransport } from "@icp-sdk/signer/web";
import { SignerAgent } from "@icp-sdk/signer/agent";

import { Connector, type ConnectorAbstract, type CreateActorArgs, type WalletConnectorConfig } from "./connectors";

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

  public type = Connector.Oisy;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: "https://signer.oisy.com",
      dev: false,
    };
  }

  async init() {
    return true;
  }

  async isConnected(): Promise<boolean> {
    return !!this.signer && !!this.agent;
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    if (!this.agent) {
      throw new Error("No signer agent available. Please connect first.");
    }

    try {
      return Actor.createActor(interfaceFactory, {
        agent: this.agent,
        canisterId,
      });
    } catch (error) {
      console.error("[Oisy] Actor creation error:", error);
      throw error;
    }
  }

  async connect() {
    const transport = new PostMessageTransport({
      url: this.config.providerUrl,
      windowOpenerFeatures: "width=525,height=705",
      establishTimeout: 45000,
      disconnectTimeout: 45000,
      detectNonClickEstablishment: false,
    });
    const signer = new Signer({ transport });

    const accounts = await signer.getAccounts();
    const account = accounts[0]; // Let the user choose if there are multiple

    const agent = await SignerAgent.create({
      signer,
      account: account.owner,
    });

    this.principal = account.owner.toString();
    this.agent = agent;
    this.signer = signer;

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
