import { Null } from "@icpswap/types";
import { Connector } from "constants/wallet";

export type LoginState = {
  name: string | Null;
  walletType: Null | Connector;
  account: string | Null;
  principal: string | Null;
};

export interface AuthState {
  name: string;
  principal: string;
  walletType: null | Connector;
  isConnected: boolean;
  account: string;
  password: string;
  walletConnectorOpen: boolean;
}

export const initialState: AuthState = {
  name: "",
  principal: "",
  walletType: null,
  isConnected: false,
  account: "",
  password: "",
  walletConnectorOpen: false,
};
