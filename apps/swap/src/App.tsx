import { useAppSelector } from "store/hooks";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "components/Mui";
import { SnackbarProvider } from "components/notistack";
import ErrorBoundary from "components/ErrorBoundary";
import TransactionsUpdater from "store/transactions/updater";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "constants/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DisableIframe } from "components/DisableIframe";
import { WalletContextProvider } from "components/Wallet/WalletContextProvider";
import NavigationScroll from "components/NavigationScroll";
import { GlobalContextProvider, useGlobalUpdater, GlobalLayout } from "components/Global";

import { theme } from "./theme";
import Routes from "./routes";
import "utils/dayjs";

export default function App() {
  const customization = useAppSelector((state) => state.customization);
  const queryClient = new QueryClient();

  useGlobalUpdater();

  return (
    <DisableIframe>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <StyledEngineProvider injectFirst>
            <WalletContextProvider>
              <TransactionsUpdater />
              <ThemeProvider theme={theme(customization)}>
                <SnackbarProvider maxSnack={100}>
                  <GlobalContextProvider>
                    <CssBaseline />
                    <NavigationScroll>
                      <ErrorBoundary>
                        <Routes />
                      </ErrorBoundary>
                      <GlobalLayout />
                    </NavigationScroll>
                  </GlobalContextProvider>
                </SnackbarProvider>
              </ThemeProvider>
            </WalletContextProvider>
          </StyledEngineProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </DisableIframe>
  );
}
