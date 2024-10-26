import { IDL } from "@dfinity/candid";
import { ActorSubclass } from "@dfinity/agent";
import { Connector } from "constants/wallet";
import { host } from "constants/server";
import { updateAuth } from "store/auth/hooks";
import { getDelegationIds } from "constants/connector";

import { InternetIdentityConnector } from "./internet-identity";
import { StoicConnector } from "./stoic";
import type { ConnectorAbstract } from "./connectors";
import { PlugConnector } from "./plug";
import { ICPSwapConnector } from "./icpswap";
import { InfinityConnector } from "./infinity";
import { MeConnector } from "./me";
import { MetamaskConnector } from "./metamask";

export class WalletConnector {
  public connector: ConnectorAbstract | null = null;

  public connectorType: Connector = Connector.ICPSwap;

  // initial connect instance
  public async init(connectorType: Connector) {
    const connector = await WalletConnector.create(connectorType);
    this.connectorType = connectorType;
    await connector?.init();
    this.connector = connector;
  }

  public static async create(connector: Connector) {
    const config = {
      host,
      whitelist: await getDelegationIds(),
    };

    switch (connector) {
      case Connector.IC:
        return new InternetIdentityConnector(config);
      case Connector.STOIC:
        return new StoicConnector(config);
      case Connector.PLUG:
        return new PlugConnector(config);
      case Connector.ICPSwap:
        return new ICPSwapConnector(config);
      case Connector.INFINITY:
        return new InfinityConnector(config);
      case Connector.ME:
        return new MeConnector(config);
      case Connector.Metamask:
        return new MetamaskConnector(config);
      default:
        throw new Error(`Connector error ${Connector}: Not support this connect for now`);
    }
  }

  public async connect() {
    if (!this.connector) return false;

    const isConnectedSuccessfully = await this.connector.connect();

    window.icConnector = this.connector;

    if (window.icConnector.getPrincipal) {
      updateAuth({ walletType: this.connectorType, principal: window.icConnector.getPrincipal });
    }

    return isConnectedSuccessfully;
  }

  public async isConnected() {
    const isConnected = await this.connector?.isConnected();
    return isConnected;
  }

  public async createActor<Service>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
  ): Promise<ActorSubclass<Service> | undefined> {
    return await this.connector?.createActor({ canisterId, interfaceFactory });
  }
}

export const connector = new WalletConnector();
