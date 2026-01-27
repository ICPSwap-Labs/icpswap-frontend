import { ICP, ICS, ckUSDC, ckBTC, ckETH } from "@icpswap/tokens";
import { Connector } from "constants/wallet";

export const DISPLAY_IN_WALLET_BY_DEFAULT = [ICP.address, ICS.address, ckUSDC.address, ckBTC.address, ckETH.address];

export const NO_HIDDEN_TOKENS = [ICP.address];

export const DEFAULT_DISPLAYED_TOKENS = [ICP, ICS, ckUSDC, ckBTC, ckETH];

export interface ConnectorConfig {
  label: string;
  value: Connector;
  logo: any;
  tips?: string;
  disabled?: boolean;
}

export const IIv2ProviderUrl = "https://id.ai";

export const ConnectorConfigs: ConnectorConfig[] = [
  {
    label: "Internet Identity",
    value: Connector.IIV2,
    logo: "/images/connect/iiv2.svg",
  },
  { label: "Plug", value: Connector.PLUG, logo: "/images/connect/Plug.svg" },
  {
    label: "Stoic Wallet",
    value: Connector.STOIC,
    logo: "/images/connect/stoic.svg",
  },
  {
    label: "ICPSwap Wallet",
    value: Connector.ICPSwap,
    logo: "/images/connect/icpswap.svg",
  },
  { label: "Google (via NFID)", value: Connector.NFID, logo: "/images/connect/NFID.svg" },
  {
    label: "Bitfinity Wallet",
    value: Connector.INFINITY,
    logo: "/images/connect/Infinity.svg",
  },
  {
    label: "AstroX ME",
    value: Connector.ME,
    logo: "/images/connect/AstroX.svg",
  },
  {
    label: "MetaMask",
    value: Connector.Metamask,
    logo: "/images/connect/metamask.svg",
  },
  {
    label: "Oisy",
    value: Connector.Oisy,
    logo: "/images/connect/Oisy.svg",
  },
];

export { Connector } from "@icpswap/actor";

export const ADDRESS_BOOK_REFRESH = "ADDRESS_BOOK_REFRESH";

export const TOKEN_BALANCE_REFRESH = "TOKEN_BALANCE_REFRESH";

export const TOKEN_ASSETS_REFRESH = "TOKEN_ASSETS_REFRESH";

export const WALLET_DRAWER_WIDTH = 382;

export const WALLET_TOKEN_SELECTOR_REFRESH = "WALLET_TOKEN_SELECTOR_REFRESH";
