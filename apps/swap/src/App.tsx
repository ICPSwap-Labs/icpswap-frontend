import { useCallback, useState } from "react";
import { useAppSelector } from "store/hooks";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useFetchXDR2USD, useFetchGlobalTokenList } from "store/global/hooks";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { Route } from "react-router-dom";
import GoogleAnalytics, { initGoogleAnalytics } from "components/GoogleAnalytics";
import { useConnectManager, useWalletConnectorManager } from "store/auth/hooks";
import RiskStatement from "components/RiskStatement";
import { SnackbarProvider } from "components/notistack";
import ErrorBoundary from "components/ErrorBoundary";
import WalletConnector from "components/authentication/ConnectorModal";
import Loader from "components/Loading/LinearLoader";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import { useFetchInfoAllTokens } from "hooks/info/useInfoTokens";
import GlobalSteps from "components/Steps/index";
import ActorInitial from "components/Actor";
import { GlobalContext } from "hooks/useGlobalContext";
import TransactionsUpdater from "store/transactions/updater";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "constants/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DisableIframe } from "components/DisableIframe";
import { usePlugExternalDisconnect } from "hooks/auth/usePlug";

import Web3Provider from "./components/Web3Injector";
import { useFetchICPPrices, useFetchAllSwapTokens } from "./store/global/hooks";
import { FullscreenLoading } from "./components/index";
import Snackbar from "./components/Snackbar";
import NavigationScroll from "./components/NavigationScroll";
import { theme } from "./theme";
import Routes from "./routes";

initGoogleAnalytics();

export default function App() {
  const [refreshTriggers, setRefreshTriggers] = useState<{ [key: string]: number }>({});
  const customization = useAppSelector((state) => state.customization);

  useFetchXDR2USD();
  useFetchICPPrices();
  useFetchInfoAllTokens();
  useFetchAllSwapTokens();
  usePlugExternalDisconnect();

  const { isConnected } = useConnectManager();

  const [walletConnectorOpen] = useWalletConnectorManager();

  const { loading: fetchGlobalTokensLoading } = useFetchGlobalTokenList();
  const { loading: isInitialStandardLoading, AllPools } = useInitialTokenStandard({ fetchGlobalTokensLoading });

  useFetchSnsAllTokensInfo();

  const queryClient = new QueryClient();

  const handleRefreshTriggers = useCallback(
    (key: string) => {
      setRefreshTriggers({ ...refreshTriggers, [key]: (refreshTriggers[key] ?? 0) + 1 });
    },
    [refreshTriggers, setRefreshTriggers],
  );

  return (
    <DisableIframe>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <StyledEngineProvider injectFirst>
            <Web3Provider>
              <Route component={GoogleAnalytics} />
              <TransactionsUpdater />
              <ThemeProvider theme={theme(customization)}>
                <SnackbarProvider maxSnack={100}>
                  <GlobalContext.Provider
                    value={{ AllPools, refreshTriggers, setRefreshTriggers: handleRefreshTriggers }}
                  >
                    <ActorInitial>
                      <CssBaseline />
                      <NavigationScroll>
                        {isInitialStandardLoading ? (
                          <Loader />
                        ) : (
                          <ErrorBoundary>
                            <Routes />
                          </ErrorBoundary>
                        )}
                        <Snackbar />
                        <FullscreenLoading />
                        <GlobalSteps />
                        {isConnected ? <RiskStatement /> : null}
                        {walletConnectorOpen ? <WalletConnector /> : null}
                      </NavigationScroll>
                    </ActorInitial>
                  </GlobalContext.Provider>
                </SnackbarProvider>
              </ThemeProvider>
            </Web3Provider>
          </StyledEngineProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </DisableIframe>
  );
}
