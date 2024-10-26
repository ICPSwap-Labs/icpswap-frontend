import { ActorSubclass } from "@dfinity/agent";
import { getStoreWalletUnlocked } from "store/auth/hooks";
import { type CreateActorArgs, ConnectorAbstract, Connector, type WalletConnectorConfig } from "./connectors";

const MAX_PLUG_WHITELIST_NUMBER = 200;

export class PlugConnector implements ConnectorAbstract {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: boolean;
  };

  private principal?: string;

  public type = Connector.PLUG;

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

    if (window.ic && window.ic.plug) {
      return await window.ic.plug.isConnected();
    }

    return false;
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
    }

    return true;
  }

  async disconnect() {
    await window.ic.plug.disconnect();
  }

  async expired() {
    return false;
  }
}
