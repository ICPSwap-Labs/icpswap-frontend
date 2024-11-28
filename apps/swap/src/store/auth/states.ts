import { Connector } from "constants/wallet";

export type LoginState = {
  name: string;
  mnemonic: null | string;
  principal: string;
  walletType: null | Connector;
  account: string;
  password: string;
};

export interface AuthState {
  name: string;
  mnemonic: null | string;
  principal: string;
  walletType: null | Connector;
  isConnected: boolean;
  account: string;
  password: string;
}

export const initialState: AuthState = {
  name: "",
  mnemonic: null,
  principal: "",
  walletType: null,
  isConnected: false,
  account: "",
  password: "",
};
