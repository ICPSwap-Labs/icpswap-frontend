import { useCallback, useState } from "react";
import { useAppSelector } from "store/hooks";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "components/Mui";
import { useFetchGlobalDefaultTokens, useFetchGlobalTokenList } from "store/global/hooks";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
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
import Web3Provider from "components/Web3Injector";
import { FullscreenLoading } from "components/index";
import NavigationScroll from "components/NavigationScroll";

import { GlobalFetch } from "./GlobalFetch";
import { useFetchAllSwapTokens } from "./store/global/hooks";
import { theme } from "./theme";
import Routes from "./routes";

import "utils/dayjs";

export default function App() {
  const customization = useAppSelector((state) => state.customization);

  const [refreshTriggers, setRefreshTriggers] = useState<{ [key: string]: number }>({});
  const [infoAllTokens, setInfoAllTokens] = useState<PublicTokenOverview[] | Null>(null);

  useFetchAllSwapTokens();
  usePlugExternalDisconnect();
  useFetchSnsAllTokensInfo();
  useFetchGlobalDefaultTokens();
  useFetchGlobalTokenList();

  const { open: connectorModalOpen, isConnected } = useConnectManager();

  const { AllPools } = useInitialTokenStandard();

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
                        <ErrorBoundary>
                          <Routes />
                        </ErrorBoundary>
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
