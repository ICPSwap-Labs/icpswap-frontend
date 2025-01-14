import { createAction } from "@reduxjs/toolkit";

import { LoginState } from "./states";

export const login = createAction<LoginState>("auth/login");

export const logout = createAction<void>("auth/logout");

export const updateConnected = createAction<{ isConnected: boolean }>("auth/updateConnected");

export const updateWalletConnector = createAction<boolean>("global/updateWalletConnector");
