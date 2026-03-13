import { CssBaseline } from "components/Mui";
import ErrorBoundary from "components/ErrorBoundary";
import NavigationScroll from "components/NavigationScroll";
import { useGlobalUpdater, GlobalLayout } from "components/Global";
import Routes from "routes/index";
import "utils/dayjs";

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
