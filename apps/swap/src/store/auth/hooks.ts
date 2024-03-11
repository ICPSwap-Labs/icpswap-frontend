import { useAppDispatch } from "store/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateLockStatus as _updateLockStatus } from "../session/actions";
import { principalToAccount } from "@icpswap/utils";
import { login, logout, updateConnected, updateWalletConnector } from "./actions";
import store from "../index";
import { useAppSelector } from "store/hooks";
import { Connector } from "constants/wallet";
import { Principal } from "@dfinity/principal";
import { getConnectorIsConnected, getConnectorPrincipal, connector, WalletConnector } from "utils/connector";
import { isMeWebview } from "utils/connector/me";
import { actor } from "@icpswap/actor";
import { isPrincipal } from "@icpswap/utils";

export function getConnectorType() {
  let connectorType = store.getState().auth.walletType;
  if (isMeWebview()) connectorType = Connector.ME;
  return connectorType;
}

export function useConnectorType() {
  const connectorType = getConnectorType();
  return useMemo(() => connectorType, [connectorType]);
}

export async function connectToConnector(connectorType: Connector) {
  await connector.init(connectorType);

  if (!(await connector.isConnected())) {
    await connector.connect();
  } else {
    if (connector.connector) {
      window.icConnector = connector.connector;
    }
  }

  return await getConnectorIsConnected();
}

export function useConnectorStateConnected() {
  const isConnected = useAppSelector((state) => state.auth.isConnected);
  const isUnLocked = useAppSelector((state) => state.session.isUnLocked);
  const walletType = useAppSelector((state) => state.auth.walletType);

  if (!walletType) return false;
  if (walletType === Connector.PLUG && !isUnLocked) return false;
  return isConnected;
}

export function getStoreWalletConnected() {
  const { auth } = store.getState();
  return auth.isConnected;
}

export function getStoreWalletUnlocked() {
  const { session } = store.getState();
  return session.isUnLocked;
}

export function useConnectManager() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const connectorStateConnected = useConnectorStateConnected();
  const isUnLocked = useIsUnLocked();
  const logout = useUserLogout();

  useEffect(() => {
    async function call() {
      const connectorType = getConnectorType();
      if (!connectorType) {
        dispatch(updateConnected({ isConnected: false }));
        setLoading(false);
        return;
      }

      const new_connector = await WalletConnector.create(connectorType);
      const expired = await new_connector.expired();

      if (expired) {
        logout();
        setLoading(false);
        return;
      }

      const isConnected = await connectToConnector(connectorType);

      if (connectorType === Connector.ME) {
        updateAuth({ walletType: Connector.ME });
      }

      dispatch(updateConnected({ isConnected }));

      if (isConnected) setActorHttpAgent();

      setLoading(false);
    }

    call();
  }, [isUnLocked]);

  return useMemo(() => ({ isConnected: connectorStateConnected, loading }), [connectorStateConnected, loading]);
}

export function useIsUnLocked() {
  return useAppSelector((state) => state.session.isUnLocked);
}

export function useAccount() {
  const principal = useAccountPrincipal();

  return useMemo(() => {
    if (!principal) return undefined;
    return principalToAccount(principal.toString());
  }, [principal]);
}

export function updateLockStatus(locked: boolean) {
  store.dispatch(_updateLockStatus(locked));
}

export interface UpdateAuthProps {
  walletType: Connector;
}

export async function updateAuth({ walletType }: UpdateAuthProps) {
  const state = store.getState();

  const principal = await getConnectorPrincipal();

  if (!principal) return;

  const account = principalToAccount(principal);

  const mnemonic =
    walletType === Connector.ICPSwap || walletType === Connector.STOIC_MNEMONIC ? state.auth.mnemonic : "";
  const password =
    walletType === Connector.ICPSwap || walletType === Connector.STOIC_MNEMONIC ? state.auth.password : "";

  store.dispatch(
    login({
      name: walletType,
      mnemonic,
      account,
      principal,
      walletType: walletType,
      password,
    }),
  );

  store.dispatch(updateConnected({ isConnected: true }));
  store.dispatch(_updateLockStatus(false));
}

export function useUserLogout() {
  const dispatch = useAppDispatch();
  const walletType = useConnectorType();

  return useCallback(async () => {
    await dispatch(logout());
    if (walletType && window.icConnector) window.icConnector.disconnect();
    await updateLockStatus(true);
    dispatch(updateConnected({ isConnected: false }));
  }, [dispatch, updateLockStatus]);
}

export function useAccountPrincipal(): Principal | undefined {
  const principal = useAppSelector((state) => state.auth.principal);
  const walletType = useAppSelector((state) => state.auth.walletType);
  const isUnLocked = useAppSelector((state) => state.session.isUnLocked);

  return useMemo(() => {
    if (!principal) return undefined;
    if (walletType === Connector.PLUG && !isUnLocked) return undefined;
    if (isPrincipal(principal)) return principal as Principal;
    return Principal.fromText(principal);
  }, [principal, walletType, isUnLocked]);
}

export function useAccountPrincipalString() {
  const principal = useAccountPrincipal();

  return useMemo(() => {
    return principal?.toString();
  }, [principal]);
}

export function setActorHttpAgent() {
  const { auth } = store.getState();
  const walletType = auth.walletType;

  if (!walletType) return;

  actor.setConnector(walletType);
}

export function useWalletConnectorManager(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.walletConnectorOpen);

  const manage = useCallback(
    (open: boolean) => {
      dispatch(updateWalletConnector(open));
    },
    [dispatch],
  );

  return [open, manage];
}
