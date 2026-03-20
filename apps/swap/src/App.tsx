import ErrorBoundary from "components/ErrorBoundary";
import { GlobalLayout, useGlobalUpdater } from "components/Global";
import { CssBaseline } from "components/Mui";
import NavigationScroll from "components/NavigationScroll";
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
