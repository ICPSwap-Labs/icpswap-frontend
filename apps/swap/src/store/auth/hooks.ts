import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { principalToAccount, isPrincipal } from "@icpswap/utils";
import { ic_host } from "@icpswap/constants";
import { Connector, IdentityKitConnector, IdentityKitId } from "constants/index";
import { Principal } from "@dfinity/principal";
import { connectManager, WalletConnector } from "utils/connector";
import { isMeWebview } from "utils/connector/me";
import { actor } from "@icpswap/actor";
import { useIsInitializing, useAuth, useAgent } from "@nfid/identitykit/react";
import { isSafari } from "utils/index";

import store from "../index";
import { login, logout, updateConnected, updateWalletConnector } from "./actions";
import { updateLockStatus as _updateLockStatus } from "../session/actions";
import { NF_IDConnector } from "./NF_IDConnector";

export function useIsUnLocked() {
  return useAppSelector((state) => state.session.isUnLocked);
}

export function getConnector() {
  let connector = store.getState().auth.walletType;
  if (isMeWebview()) connector = Connector.ME;
  return connector;
}

export function useConnector() {
  const connector = getConnector();
  return useMemo(() => connector, [connector]);
}

export function useConnectorStateConnected() {
  const isConnected = useAppSelector((state) => state.auth.isConnected);
  const isUnLocked = useAppSelector((state) => state.session.isUnLocked);
  const walletType = useAppSelector((state) => state.auth.walletType);

  if (!walletType) return false;
  if (walletType === Connector.PLUG && !isUnLocked) return false;

  return isConnected;
}

export function getStoreWalletUnlocked() {
  const { session } = store.getState();
  return session.isUnLocked;
}

export interface UpdateAuthProps {
  walletType: Connector;
  principal?: string;
  connected?: boolean;
}

export async function updateAuth({ principal, walletType, connected }: UpdateAuthProps) {
  store.dispatch(
    login({
      name: walletType,
      principal,
      walletType,
    }),
  );

  if (connected === false) return;

  store.dispatch(updateConnected({ isConnected: true }));
  store.dispatch(_updateLockStatus(false));
}

export function updateLockStatus(locked: boolean) {
  store.dispatch(_updateLockStatus(locked));
}

export function useLogout() {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    dispatch(logout());
    updateLockStatus(true);
    dispatch(updateConnected({ isConnected: false }));
  }, [dispatch, updateLockStatus]);
}

export function useDisconnect() {
  const dispatch = useAppDispatch();
  const walletType = useConnector();

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

export function useAccount() {
  const principal = useAccountPrincipal();

  return useMemo(() => {
    if (!principal) return undefined;
    return principalToAccount(principal.toString());
  }, [principal]);
}

export function useAccountPrincipalString() {
  const principal = useAccountPrincipal();

  return useMemo(() => {
    return principal?.toString();
  }, [principal]);
}

async function nonAsyncFunctionBeforeConnect(connected: boolean | undefined) {
  if (!connected) await connectManager.connect();
}

export function useInitialConnect() {
  const dispatch = useAppDispatch();
  const isUnLocked = useIsUnLocked();
  const disconnect = useDisconnect();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function call() {
      const connector = getConnector();

      if (!connector) {
        dispatch(updateConnected({ isConnected: false }));
        setLoading(false);
        return;
      }

      if (IdentityKitConnector.includes(connector)) {
        setLoading(false);
        return;
      }

      await connectManager.init(connector);
      const expired = await connectManager.connector?.expired();

      if (expired) {
        disconnect();
        setLoading(false);
        return;
      }

      const connected = await connectManager.isConnected();

      await nonAsyncFunctionBeforeConnect(connected);

      dispatch(updateConnected({ isConnected: true }));
      // Initial actor
      actor.setConnector(connector);
      setLoading(false);
    }

    call();
  }, [isUnLocked]);

  return useMemo(() => ({ loading }), [loading]);
}

export function useIdentityKitInitialConnect() {
  const dispatch = useAppDispatch();

  const isInitializing = useIsInitializing();

  const { user } = useAuth();
  const agent = useAgent({ host: ic_host });
  // const disconnect = useDisconnect();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function call() {
      const connector = getConnector();

      if (!connector) {
        dispatch(updateConnected({ isConnected: false }));
        setLoading(false);
        return;
      }

      if (IdentityKitConnector.includes(connector)) {
        // TODO:
        // The returned user is undefined is initializing, so disable disconnect for now.
        // Do something when IdentityKit is out session

        // if (isInitializing === false && isUndefinedOrNull(user)) {
        //   await disconnect();
        //   setLoading(false);
        //   return;
        // }

        if (user && user.principal) {
          updateAuth({ walletType: connector, principal: user.principal.toString() });
          dispatch(updateConnected({ isConnected: true }));
          // Initial actor
          actor.setConnector(connector);

          if (agent) {
            // @ts-ignore
            window.icConnector = new NF_IDConnector(agent);
          }
        }
      }

      setLoading(false);
    }

    call();
  }, [connectManager, isInitializing, user, agent]);

  return useMemo(
    () => ({
      loading,
    }),
    [loading],
  );
}

export function useConnectManager() {
  const dispatch = useAppDispatch();
  const connectorStateConnected = useConnectorStateConnected();
  const authDisconnect = useDisconnect();
  const open = useAppSelector((state) => state.auth.walletConnectorOpen);
  const connector = useAppSelector((state) => state.auth.walletType);

  const { connect: identityKitConnect, disconnect: identityKitDisconnect } = useAuth();

  const showConnector = useCallback(
    (open: boolean) => {
      dispatch(updateWalletConnector(open));
    },
    [dispatch],
  );

  const connect = useCallback(async (connector: Connector, connectorOutside?: null | WalletConnector) => {
    if (IdentityKitConnector.includes(connector)) {
      await identityKitConnect(IdentityKitId[connector]);
      updateAuth({ walletType: connector, connected: false });
      return true;
    }

    // Fix pop-up window was blocked when there is a asynchronous call before connecting the wallet
    if (isSafari()) {
      if (connectorOutside) {
        return await connectorOutside.connect();
      }

      throw new Error("Some unknown error happened. Please refresh the page to reconnect.");
    }

    await connectManager.init(connector);
    return await connectManager.connect();
  }, []);

  const disconnect = useCallback(async () => {
    if (connector) {
      if (IdentityKitConnector.includes(connector)) {
        await identityKitDisconnect();
      }
    }

    await authDisconnect();
  }, [connector]);

  const { loading } = useInitialConnect();
  useIdentityKitInitialConnect();

  return useMemo(
    () => ({
      open,
      connect,
      disconnect,
      showConnector,
      isConnected: connectorStateConnected,
      loading,
    }),
    [open, connect, disconnect, showConnector, connectorStateConnected, loading],
  );
}
