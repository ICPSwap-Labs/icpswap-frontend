import { useAppSelector } from "store/hooks";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useFetchXDR2USD, useFetchGlobalTokenList, useFetchSNSTokenRootIds } from "store/global/hooks";
import { Route } from "react-router-dom";
import GoogleAnalytics, { initGoogleAnalytics } from "components/GoogleAnalytics";
import { useConnectManager, useWalletConnectorManager } from "store/auth/hooks";
import RiskStatement from "components/RiskStatement";
import { SnackbarProvider } from "components/notistack";
import ErrorBoundary from "components/ErrorBoundary";
import WalletConnector from "components/authentication/ConnectorModal";
import Loader from "components/Loading/LinearLoader";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import GlobalSteps from "components/Steps/index";
import ActorInitial from "components/Actor";
import { GlobalContext } from "hooks/useGlobalContext";
import Web3Provider from "./components/Web3Injector";
import { useFetchICPPrices } from "./store/global/hooks";
import { FullscreenLoading } from "./components/index";
import Snackbar from "./components/Snackbar";
import NavigationScroll from "./components/NavigationScroll";
import { theme } from "./theme";
import Routes from "./routes";

initGoogleAnalytics();

export default function App() {
  const customization = useAppSelector((state) => state.customization);

  useFetchXDR2USD();
  useFetchICPPrices();

  const { isConnected } = useConnectManager();

  const [walletConnectorOpen] = useWalletConnectorManager();

  const { loading: fetchGlobalTokensLoading } = useFetchGlobalTokenList();
  const { loading: isInitialStandardLoading, AllPools } = useInitialTokenStandard({ fetchGlobalTokensLoading });

  useFetchSNSTokenRootIds();

  return (
    <StyledEngineProvider injectFirst>
      <Web3Provider>
        <Route component={GoogleAnalytics} />
        <ThemeProvider theme={theme(customization)}>
          <SnackbarProvider maxSnack={100}>
            <GlobalContext.Provider value={{ AllPools }}>
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
  );
}
