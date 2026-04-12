import ErrorBoundary from "components/ErrorBoundary";
import { GlobalLayout, useGlobalUpdater } from "components/Global";
import { CssBaseline } from "components/Mui";
import NavigationScroll from "components/NavigationScroll";
import Routes from "routes/index";
import "utils/dayjs";
// TODO: remove this import after we find a better way to import echarts
// import echarts global,
// otherwise it will cause the error "echarts is not defined" when importing echarts in @icpswap/ui
import "components/echarts";

export const App = () => {
  useGlobalUpdater();

  return (
    <>
      <CssBaseline />
      <NavigationScroll>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
        <GlobalLayout />
      </NavigationScroll>
    </>
  );
};
