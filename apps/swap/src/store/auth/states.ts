import type { Null } from "@icpswap/types";
import type { Connector } from "constants/wallet";

export type LoginState = {
  name: string | Null;
  walletType: Null | Connector;
  principal: string | Null;
};

export interface AuthState {
  name: string;
  principal: string;
  walletType: null | Connector;
  isConnected: boolean;
  password: string;
  walletConnectorOpen: boolean;
}

export const initialState: AuthState = {
  name: "",
  principal: "",
  walletType: null,
  isConnected: false,
  password: "",
  walletConnectorOpen: false,
};
