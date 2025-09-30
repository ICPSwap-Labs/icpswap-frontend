import { IDL } from "@dfinity/candid";
import { ActorSubclass } from "@dfinity/agent";
import { Connector, IIv2ProviderUrl } from "constants/wallet";
import { host } from "constants/server";
import { updateAuth } from "store/auth/hooks";
import { getDelegationIds } from "constants/connector";
import { nonUndefinedOrNull } from "@icpswap/utils";
import type { ConnectorAbstract } from "utils/connector/connectors";
import { InternetIdentityConnector } from "utils/connector/internet-identity";
import { StoicConnector } from "utils/connector/stoic";
import { PlugConnector } from "utils/connector/plug";
import { ICPSwapConnector } from "utils/connector/icpswap";
import { InfinityConnector } from "utils/connector/infinity";
import { isMeWebview, MeConnector } from "utils/connector/me";
import { MetamaskConnector } from "utils/connector/metamask";
import { OisyConnector } from "utils/connector/Oisy";

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
      if (nonUndefinedOrNull(this.connector?.getPrincipal)) {
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
      case Connector.IIV2:
        return new InternetIdentityConnector({
          ...config,
          providerUrl: IIv2ProviderUrl,
        });
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

    if (nonUndefinedOrNull(window.icConnector.getPrincipal)) {
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
