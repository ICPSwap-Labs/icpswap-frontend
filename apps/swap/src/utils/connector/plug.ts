import { ActorSubclass } from "@dfinity/agent";
import { getStoreWalletUnlocked } from "store/auth/hooks";
import { Principal } from "@dfinity/principal";
import { Signer } from "@slide-computer/signer";
import { SignerAgent } from "@slide-computer/signer-agent";
import { actor } from "@icpswap/actor";

import { PlugTransport } from "./channel/PlugChannel";
import { type CreateActorArgs, IConnector, ConnectorType, type WalletConnectorConfig } from "./connectors";

const MAX_PLUG_WHITELIST_NUMBER = 200;

export class PlugConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: boolean;
  };

  private principal?: string;

  public type = ConnectorType.PLUG;

  public get getPrincipal() {
    return this.principal;
  }

  constructor(config: WalletConnectorConfig) {
    this.config = {
      whitelist: config.whitelist,
      host: config.host,
      providerUrl: "",
      dev: false,
    };
  }

  async init() {
    return true;
  }

  async createActor<Service>({
    canisterId,
    interfaceFactory,
  }: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
    return await window.ic.plug.createActor<Service>({
      canisterId,
      interfaceFactory,
    });
  }

  async isConnected() {
    const isUnLocked = getStoreWalletUnlocked();

    if (typeof isUnLocked === "boolean" && !isUnLocked) {
      return false;
    }

    let isConnected = false;

    if (window.ic && window.ic.plug) {
      isConnected = await window.ic.plug.isConnected();
    }

    this.principal = window.ic.plug.principalId;

    return isConnected;
  }

  async connect() {
    // Fix tracing message if plug is uninstalled but still connect to
    if (!window.ic?.plug) {
      return false;
    }

    if (await this.isConnected()) {
      this.principal = window.ic.plug.principalId;
    } else {
      await window.ic.plug.requestConnect({
        whitelist:
          this.config.whitelist.length > MAX_PLUG_WHITELIST_NUMBER
            ? this.config.whitelist.slice(0, MAX_PLUG_WHITELIST_NUMBER)
            : this.config.whitelist,
      });
      this.principal = window.ic.plug.principalId;

      const transport = new PlugTransport();
      const signer = new Signer({ transport });
      await signer.requestPermissions([
        { method: "icrc27_accounts" },
        { method: "icrc49_call_canister" },
        { method: "icrc34_delegation" },
      ]);
    }

    await this.signer();

    return true;
  }

  async disconnect() {
    await window.ic.plug.disconnect();
  }

  async expired() {
    return false;
  }

  async signer() {
    const transport = new PlugTransport();
    const signer = new Signer({ transport });

    if (!this.principal) {
      throw new Error("No principal when initial signer");
    }

    const signerAgent = new SignerAgent({
      signer,
      account: Principal.fromText(this.principal),
    });

    actor.setAgent(signerAgent);
  }
}
