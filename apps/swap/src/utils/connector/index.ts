import { IDL } from "@dfinity/candid";
import { ActorSubclass } from "@dfinity/agent";
import { Connector } from "constants/wallet";
import { host } from "constants/server";
import { updateAuth } from "store/auth/hooks";
import { getDelegationIds } from "constants/connector";
import { nonNullArgs } from "@icpswap/utils";

import type { ConnectorAbstract } from "./connectors";

import { InternetIdentityConnector } from "./internet-identity";
import { StoicConnector } from "./stoic";
import { PlugConnector } from "./plug";
import { ICPSwapConnector } from "./icpswap";
import { InfinityConnector } from "./infinity";
import { isMeWebview, MeConnector } from "./me";
import { MetamaskConnector } from "./metamask";
import { OisyConnector } from "./Oisy";

export class WalletConnector {
  public connector: ConnectorAbstract | null = null;

  public connectorType: Connector = Connector.ICPSwap;

  // initial connect instance
  public async init(connectorType: Connector) {
    if (!this.connector || this.connector.type !== connectorType) {
      const connector = await WalletConnector.create(connectorType);
      this.connectorType = connectorType;
      await connector.init();
      this.connector = connector;
      window.icConnector = this.connector;
    }

    // For only Me wallet app
    if (isMeWebview()) {
      if (nonNullArgs(this.connector?.getPrincipal)) {
        updateAuth({ walletType: this.connectorType, principal: this.connector.getPrincipal });
      }
    }
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
      case Connector.Oisy:
        return new OisyConnector(config);
      default:
        throw new Error(`Connector error ${Connector}: Not support this connect for now`);
    }
  }

  public async connect() {
    if (!this.connector) return false;

    const connected = await this.connector.connect();

    window.icConnector = this.connector;

    if (nonNullArgs(window.icConnector.getPrincipal)) {
      updateAuth({ walletType: this.connectorType, principal: window.icConnector.getPrincipal });
    }

    return connected;
  }

  public async isConnected() {
    return await this.connector?.isConnected();
  }

  public async createActor<Service>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
  ): Promise<ActorSubclass<Service> | undefined> {
    return await this.connector?.createActor({ canisterId, interfaceFactory });
  }
}

export const connectManager = new WalletConnector();
