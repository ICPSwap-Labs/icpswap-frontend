import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import Loader from "ui-component/Loading/LinearLoader";
import { useInitialXDR2USD } from "hooks/useXDR2USD";
import { useFetchInfoAllTokens } from "hooks/info/useInfoTokens";
import Routes from "./routes";
import { theme } from "./themes";
import NavigationScroll from "./ui-component/NavigationScroll";
import Snackbar from "./ui-component/Snackbar";
import { useICPPrices, useFetchSNSTokenRootIds } from "./store/global/hooks";

export default function App() {
  const { loading: initialTokenStandardLoading } = useInitialTokenStandard();

  useICPPrices();
  useInitialXDR2USD();
  useFetchSNSTokenRootIds();
  useFetchInfoAllTokens();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme({ navType: "dark" })}>
        <CssBaseline />
        <NavigationScroll>
          {initialTokenStandardLoading ? <Loader /> : <Routes />}
          <Snackbar />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
