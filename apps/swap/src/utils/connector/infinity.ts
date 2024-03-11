import { ActorSubclass } from "@dfinity/agent";
import { type CreateActorArgs, IConnector, ConnectorType, WalletConnectorConfig } from "./connectors";
import { getStoreWalletUnlocked } from "store/auth/hooks";

export class InfinityConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: Boolean;
  };
  private principal?: string;
  public type = ConnectorType.INFINITY;

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
    return await window.ic.infinityWallet.createActor({ canisterId, interfaceFactory });
  }

  async isConnected() {
    const isUnLocked = getStoreWalletUnlocked();

    if (typeof isUnLocked === "boolean" && !isUnLocked) {
      return false;
    }

    if (window.ic.infinityWallet) {
      return await window.ic.infinityWallet.isConnected();
    }

    return false;
  }

  async connect() {
    if (await this.isConnected()) {
      this.principal = (await window.ic.infinityWallet.getPrincipal()).toString();
    } else {
      // disconnect first
      await window.ic.infinityWallet.disconnect();
      await window.ic.infinityWallet.requestConnect({ whitelist: this.config.whitelist });

      this.principal = (await window.ic.infinityWallet.getPrincipal()).toString();
    }

    return true;
  }

  async disconnect() {
    await window.ic.infinityWallet.disconnect();
  }

  async expired() {
    return false;
  }
}

export const InfinitySwapWallet = {
  connector: InfinityConnector,
  id: "infinity",
  type: ConnectorType.INFINITY,
};
