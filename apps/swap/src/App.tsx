import { useCallback, useState } from "react";
import { useAppSelector } from "store/hooks";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useFetchXDR2USD, useFetchGlobalTokenList } from "store/global/hooks";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { Route } from "react-router-dom";
import GoogleAnalytics, { initGoogleAnalytics } from "components/GoogleAnalytics";
import { useConnectManager } from "store/auth/hooks";
import { usePlugExternalDisconnect } from "hooks/auth/usePlug";
import RiskStatement from "components/RiskStatement";
import { SnackbarProvider } from "components/notistack";
import ErrorBoundary from "components/ErrorBoundary";
import WalletConnector from "components/authentication/ConnectorModal";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import GlobalSteps from "components/Steps/index";
import ActorInitial from "components/Actor";
import { GlobalContext } from "hooks/useGlobalContext";
import TransactionsUpdater from "store/transactions/updater";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "constants/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DisableIframe } from "components/DisableIframe";
import { PublicTokenOverview, Null } from "@icpswap/types";
import { LinearLoader } from "@icpswap/ui";

import { GlobalFetch } from "./GlobalFetch";
import Web3Provider from "./components/Web3Injector";
import { useFetchICPPrices, useFetchAllSwapTokens } from "./store/global/hooks";
import { FullscreenLoading } from "./components/index";
import Snackbar from "./components/Snackbar";
import NavigationScroll from "./components/NavigationScroll";
import { theme } from "./theme";
import Routes from "./routes";

import "utils/dayjs";

initGoogleAnalytics();

export default function App() {
  const customization = useAppSelector((state) => state.customization);

  const [refreshTriggers, setRefreshTriggers] = useState<{ [key: string]: number }>({});
  const [infoAllTokens, setInfoAllTokens] = useState<PublicTokenOverview[] | Null>(null);

  useFetchXDR2USD();
  useFetchICPPrices();
  useFetchAllSwapTokens();
  usePlugExternalDisconnect();
  useFetchSnsAllTokensInfo();

  const { open: connectorModalOpen, isConnected } = useConnectManager();

  const { loading: fetchGlobalTokensLoading } = useFetchGlobalTokenList();
  const { loading: isInitialStandardLoading, AllPools } = useInitialTokenStandard({ fetchGlobalTokensLoading });

  const queryClient = new QueryClient();

  const handleRefreshTriggers = useCallback(
    (key: string) => {
      setRefreshTriggers((prevState) => ({ ...prevState, [key]: (prevState[key] ?? 0) + 1 }));
    },
    [setRefreshTriggers],
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
                    value={{
                      AllPools,
                      refreshTriggers,
                      setRefreshTriggers: handleRefreshTriggers,
                      infoAllTokens,
                      setInfoAllTokens,
                    }}
                  >
                    <ActorInitial>
                      <CssBaseline />
                      <NavigationScroll>
                        {isInitialStandardLoading ? (
                          <LinearLoader />
                        ) : (
                          <ErrorBoundary>
                            <Routes />
                          </ErrorBoundary>
                        )}
                        <Snackbar />
                        <FullscreenLoading />
                        <GlobalSteps />
                        <GlobalFetch />
                        {isConnected ? <RiskStatement /> : null}
                        {connectorModalOpen ? <WalletConnector /> : null}
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
